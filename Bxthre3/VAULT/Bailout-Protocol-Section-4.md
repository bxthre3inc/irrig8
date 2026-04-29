% ---------------------------------------------------------------
% Section 4 — Implementation in the BX3 Framework
% Paper: Bailout Protocol: Mandatory Human Accountability in Multi-Agent Systems
% ---------------------------------------------------------------

\section{Implementation in the BX3 Framework}
\label{sec:bailout-implementation}

The Bailout Protocol is not an isolated mechanism. It is a co-requisite component of the BX3 Framework's three-layer architecture --- Purpose, Bounds Engine, and Fact Layer --- and its correctness is architecturally inseparable from the correctness of those layers. This section specifies the implementation details that bind the protocol to the BX3 Framework: the initialization of the Human Accountability Anchor in the Purpose Layer (\ref{sec:human-anchor-purpose}), the evaluation logic within the Bounds Engine that fires trigger conditions (\ref{sec:bounds-engine-trigger}), the Fact Layer's enforcement of the audit trail and Sandbox Gate (\ref{sec:fact-layer-enforcement}), the Forensic Ledger structure (\ref{sec:forensic-ledger}), and the state machine as a Fact Layer extension (\ref{sec:state-machine-fact-layer}).

% ----------------------------------------------------------------
\subsection{Human Accountability Anchor in the Purpose Layer}
\label{sec:human-anchor-purpose}

Every BX3 node is initialized with an immutable \texttt{humanRoot} field that is sealed at the moment of node instantiation and propagated downward to all descendants through the \texttt{parentPurposeHash} mechanism. This field is the structural terminus of the Bailout Protocol: the unique node to which every trigger must eventually propagate, and the only node in the hierarchy that is authorized to issue a binding resolution.

The \texttt{humanRoot} field is not a configuration parameter --- it is a Purpose Layer commitment. It is written at Plane P1 (Mandate) as an append-only record, sealed with the Human Root's issued credential, and carries the full cryptographic weight of the Fact Layer's immutability guarantee. Once set, it cannot be altered by any Machine actor at any plane, including the Bounds Engine's self-modification mechanisms.

Formally, at node initialization:

\begin{equation}
\text{purposeLayer}[n].\texttt{humanRoot} \;=\;
\begin{cases}
n.\texttt{nodeId} & \text{if } n \text{ is the Human Accountability Anchor} \\
\text{purposeLayer}[n.\texttt{parent}].\texttt{humanRoot} & \text{otherwise}
\end{cases}
\end{equation}

The derivation is deterministic and acyclic: following parent pointers from any node terminates at a unique Human Accountability Anchor (BX3 Invariant I2). This immutability is what makes the \texttt{humanRoot} a trustworthy propagation target for the Bailout Protocol's escalation algorithm (Algorithm~\ref{alg:escalation}, Section~\ref{sec:escalation}).

The Purpose Layer also carries the \texttt{accountabilityBoundary} field, which defines the classes of action that require explicit human authorization regardless of the node's technical capability to execute them. This field is the third trigger condition (\texttt{accountability\\_boundary}, Section~\ref{sec:trigger-conditions}) and is established as a governance policy directive at Plane P2 (Intent).

% ----------------------------------------------------------------
\subsection{Bounds Engine Trigger Evaluation}
\label{sec:bounds-engine-trigger}

At every decision cycle, the Bounds Engine evaluates whether the proposed action $p$ satisfies the three trigger conditions before the action can proceed to the Fact Layer for execution. This evaluation is a non-optional gate in the decision cycle --- it is not conditional on the node's confidence level or the operational mode of the system.

The evaluation sequence is fixed (Section~\ref{sec:trigger-conditions}):

\begin{enumerate}
  \item[\textbf{C1}] $\texttt{capability\\_boundary}$: the proposed action $a$ is checked against $\texttt{capabilitySet}$. If $a \notin \texttt{capabilitySet}$, the trigger fires immediately.
  \item[\textbf{C2}] $\texttt{safety\\_envelope\\_predicted}$: the bounded-reasoning engine projects $p$ forward in time against the declared \texttt{SafetyEnvelope}. If a violation is forecast with confidence $c \geq \tau$, the trigger fires.
  \item[\textbf{C3}] $\texttt{accountability\\_boundary}$: the governance policy is consulted to determine whether actions of class $a$ require explicit human authorization. If \texttt{policyCheck}(a) = \texttt{HUMAN\\_REQUIRED}, the trigger fires.
\end{enumerate}

A match on any condition is sufficient to fire the trigger; subsequent conditions are not evaluated. The matched condition is recorded as an immutable \texttt{triggerCondition} field in the \texttt{BailoutTrigger} payload.

When a trigger fires, the Bounds Engine transitions from ordinary decision-making mode into protocol mode. It executes the \texttt{fire()} operation at Plane P1, which:

\begin{itemize}
  \item Authors the \texttt{BailoutTrigger} record with the trigger condition, originating node, and timestamp.
  \item Seals the trigger record using SHA-256 (Pillar 3 of the BX3 Framework), producing the \texttt{triggerSeal} field.
  \item Transitions the state machine to \texttt{BOUNDED} (Section~\ref{sec:state-machine}).
  \item Initiates the escalation loop by calling \texttt{receiveAndPropagate()} at the originating node.
\end{itemize}

The Bounds Engine's limbless property --- it proposes but never executes --- is architecturally enforced by the Fact Layer's Sandbox Gate. The \texttt{fire()} operation does not execute physical action; it authors a record and triggers propagation. The protocol cannot be invoked by the Bounds Engine to bypass the Sandbox Gate and proceed with a contested action: the protocol is precisely the mechanism that halts autonomous execution pending human resolution.

This is the key architectural property: the Bailout Protocol is triggered \emph{by} the Bounds Engine but operates \emph{above} it. The Bounds Engine evaluates conditions and fires triggers; it does not resolve them. Resolution authority rests exclusively at the Human Accountability Anchor.

% ----------------------------------------------------------------
\subsection{Fact Layer Enforcement}
\label{sec:fact-layer-enforcement}

The Fact Layer provides two co-requisite enforcement mechanisms for the Bailout Protocol: the append-only Forensic Ledger integrity property, and the Sandbox Gate that prevents autonomous execution of a \texttt{resolve()} operation.

% ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\subsubsection{Forensic Ledger}
\label{sec:forensic-ledger}

The Forensic Ledger is the append-only, tamper-evident audit trail maintained by the Fact Layer across all nine planes of the 9-Plane Data Action Protocol (DAP). Every Bailout Protocol state transition and propagation event is recorded as a ledger entry with the following structure:

\begin{verbatim}
LedgerEntry {
  entryNumber   : uint64
  planeId       : P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9
  eventType     : TRIGGER_FIRED | ESCALATED | ARRIVED |
                  HUMAN_ACKNOWLEDGED | RESOLVED | TIMEOUT
  nodeId        : identifier
  triggerId     : identifier
  triggerCondition : string
  timestamp     : hardware-secure-timestamp
  prevHash      : SHA-256 hash of preceding entry
  contentHash   : SHA-256 hash of payload
  propagationChain : list[nodeId]  // appended at each hop
  resolver      : identifier | null
}
\end{verbatim}

Each entry is sealed with SHA-256. The \texttt{prevHash} field chains entries cryptographically: any retrospective modification to a historical entry breaks the chain at that point, making the break detectable in O(1) verification time via hash recomputation. This is the Fact Layer's physical enforcement of immutability --- not software permissions, but cryptographic structure.

For the Bailout Protocol specifically, the ledger records:

\begin{itemize}
  \item \textbf{P1 — Mandate:} The \texttt{humanRoot} field sealed at node initialization.
  \item \textbf{P4 — Reason Log:} The trigger condition evaluation, including the projected safety envelope violation if applicable.
  \item \textbf{P5 — Decision:} The decision to fire the trigger, recorded as a \texttt{TRIGGER\\_FIRED} entry at the originating node.
  \item \textbf{P7 — Outcome Record:} Each \texttt{ESCALATED} entry appended by intermediate nodes during propagation; the \texttt{HUMAN\\_REVIEW} entry at the anchor; the \texttt{RESOLUTION\\_RECORDED} entry at resolution.
\end{itemize}

The Forensic Ledger is shared across all nodes in the hierarchy. A gap in the propagation chain --- an expected \texttt{ESCALATED} entry at node $n_i$ that is absent from the ledger --- is detectable by the monitoring layer and constitutes a violation of the mandatory propagation invariant (Invariant I1, Section~\ref{sec:bailout-guarantees}).

% ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\subsubsection{Sandbox Gate}
\label{sec:sandbox-gate}

The Sandbox Gate is the Fact Layer's pre-execution validation mechanism. Before any physical action is executed by the Fact Layer, the proposed action is modeled in a digital twin environment. The Sandbox Gate produces a \texttt{SANDBOX\\_APPROVED} or \texttt{SANDBOX\\_BLOCKED} verdict.

For the Bailout Protocol, the Sandbox Gate enforces two critical constraints:

\begin{enumerate}
  \item \textbf{Execution blocked while \texttt{humanReview} is active.} Any \texttt{EXECUTE} request for the action $a$ that originally triggered the bail-out is blocked if $t.\mathrm{status} = \texttt{human\\_review}$. The Fact Layer's \texttt{statusCheck} method queries the state machine; if the trigger is in \texttt{human\\_review} or any upstream transient state, execution is denied.

  \item \textbf{\texttt{resolve()} is human-only.} The \texttt{resolve()} operation that transitions a trigger from \texttt{human\\_review} to \texttt{resolved} is checked by the Sandbox Gate. The \texttt{resolver} field must contain the human-issued \texttt{nodeId} of \texttt{humanRoot}. A \texttt{resolve()} call originating from any Machine actor (Plane P0--P6) fails the Sandbox Gate's credential check and is rejected.
\end{enumerate}

These constraints are not software permissions --- they are physical enforcement properties of the Fact Layer. The Sandbox Gate's verdict cannot be overridden by the Bounds Engine, cannot be suppressed by a compromised intermediate node, and cannot be bypassed by re-routing the action through a different subtree.

Together, the Forensic Ledger and the Sandbox Gate constitute the Fact Layer's enforcement of the Bailout Protocol's SAFETY guarantee: the protocol's trigger cannot be autonomously resolved, and every state transition is immutably recorded.

% ----------------------------------------------------------------
\subsection{The Bailout Protocol as Runtime Expression of the Accountability Guarantee}
\label{sec:bailout-runtime-expression}

The BX3 Framework declares at the Purpose Layer an abstract accountability guarantee: \emph{every autonomous action must be attributable to a human decision-maker}. This guarantee is a specification at design time. The Bailout Protocol is the mechanism that converts this specification into an operative, runtime constraint on every decision cycle of every node in the system.

The relationship between the guarantee and the protocol can be stated precisely:

\begin{enumerate}
  \item The \texttt{humanRoot} field in the Purpose Layer establishes the \emph{existence} and \emph{uniqueness} of the human accountable for every node's actions.
  \item The \texttt{accountabilityBoundary} field in the Purpose Layer defines the \emph{scope} of actions that require human authorization.
  \item The Bounds Engine's trigger evaluation (Section~\ref{sec:bounds-engine-trigger}) implements the \emph{detection} mechanism: every decision cycle checks whether the proposed action falls within the accountability boundary.
  \item The Bailout Protocol's escalation algorithm (Algorithm~\ref{alg:escalation}) implements the \emph{transfer} mechanism: detected uncertainty is propagated to the \texttt{humanRoot} without bypass of intermediate Machine actors.
  \item The Fact Layer's Sandbox Gate and Forensic Ledger implement the \emph{enforcement} mechanism: autonomous resolution is structurally impossible, and every state transition is immutably recorded.
\end{enumerate}

Without the Bailout Protocol, the BX3 Framework's accountability guarantee is a declaration without an execution path. A node whose governance policy declares that class-$X$ actions require human authorization would have no architectural mechanism to enforce this declaration when the node encounters a class-$X$ action in operation. The Bounds Engine could evaluate the condition and log the violation, but without the Bailout Protocol there is no mandatory, non-bypassable escalation path to the human.

With the Bailout Protocol, the guarantee becomes a structural constraint: the trigger fires, propagation is mandatory, the Sandbox Gate blocks execution pending resolution, and the human's decision is recorded in the Forensic Ledger. The accountability guarantee is no longer a specification --- it is an invariant of the system's runtime state machine.

This is why the Bailout Protocol is listed as Pillar 5 of the BX3 Framework: it is the enforcement mechanism for the upstream guarantees declared by the other four pillars. Loop Isolation (P1) defines the layer boundaries; Recursive Spawning (P2) defines the child-provisioning mechanism; the \texttt{parentPurposeHash} chain carries the accountability anchor downward. The Bailout Protocol is what makes the anchor usable at runtime.

% ----------------------------------------------------------------
\subsection{The State Machine as a Fact Layer Extension}
\label{sec:state-machine-fact-layer}

The Bailout Protocol's state machine (Section~\ref{sec:state-machine}) is not a standalone component --- it is an extension of the Fact Layer's enforcement architecture. Its six transient states and two terminal states map directly onto the Fact Layer's plane model, and its transition function is enforced by the same append-only ledger integrity property that governs all Fact Layer events.

The mapping between the state machine's states and the 9-Plane DAP is as follows:

\begin{itemize}
  \item \texttt{IDLE} is not a plane entry --- it represents the absence of a trigger. No ledger entry is written.
  \item \texttt{BOUNDED} corresponds to Plane P1 (Mandate): the trigger is authored and the trigger condition is sealed as a Purpose Layer commitment.
  \item \texttt{BAIL\\_PENDING} corresponds to Plane P4 (Reason Log): each intermediate node appends an \texttt{ESCALATED} entry recording the propagation event and the node's witness record.
  \item \texttt{ESCALATING} corresponds to Plane P5 (Decision): the trigger has arrived at the Human Accountability Anchor, and a human decision is required.
  \item \texttt{HUMAN\\_ACKNOWLEDGED} corresponds to Plane P7 (Outcome Record): the human has acknowledged the trigger, recorded as a \texttt{HUMAN\\_REVIEW} entry in the Forensic Ledger.
  \item \texttt{RESOLVED} corresponds to Plane P8 (Execution): the human's resolution is recorded as a \texttt{RESOLUTION\\_RECORDED} entry and the action is executed or denied accordingly.
  \item \texttt{TIMEOUT} corresponds to Plane P9 (Projection Confirmation): the deadline has elapsed without resolution, producing a \texttt{TRIGGER\\_TIMEOUT} entry.
\end{itemize}

This mapping is not metaphorical --- it is structural. The state machine's transitions are enforced by the Fact Layer's append-only property: each transition requires a corresponding ledger entry at the correct plane. A transition that cannot be recorded in the ledger cannot occur, because the state machine's atomic transition function is implemented by the Fact Layer's atomic write operation.

Conversely, every Fact Layer ledger entry related to the Bailout Protocol is a state machine event. The ledger is not a separate logging system --- it is the state machine's immutable history. The \texttt{verify()} method on the ledger recomputes the hash chain and compares it to the stored value; any inconsistency between the ledger entries and the state machine's current state is a detectable anomaly.

This tight integration between the state machine and the Fact Layer is what makes the Bailout Protocol's guarantees architecturally non-optional. A system that implements the Bailout Protocol's state machine but omits the Fact Layer's ledger integrity property would have a state machine that could be altered retrospectively --- a compromised node could rewrite its local state to claim resolution without human action. Similarly, a system that implements the Fact Layer's ledger without the Bailout Protocol's state machine lacks the deterministic transition rules that make the ledger entries interpretable as protocol events.

The state machine and the Fact Layer are co-requisite components of a single enforcement mechanism. Together they guarantee that the protocol's SAFETY property (no autonomous resolution) and LIVENESS property (eventual human contact) are consequences of the architecture, not of the honesty of any individual node.

\endinput