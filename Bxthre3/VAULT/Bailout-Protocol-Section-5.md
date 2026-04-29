% ---------------------------------------------------------------
% Section 5 — Guarantees and Correctness Properties
% Paper: Bailout Protocol: Mandatory Human Accountability in Multi-Agent Systems
% ---------------------------------------------------------------

\section{Guarantees and Correctness Properties}
\label{sec:bailout-guarantees}

The preceding sections define the Bailout Protocol as a state machine, a trigger-and-escalation algorithm, and a set of BX3 Framework integration mechanisms. This section derives and formally states the three correctness guarantees that the protocol provides to any system implementing it: SAFETY (no autonomous collapse), LIVENESS (eventual human contact), and ACCOUNTABILITY (human always identifiable). For each guarantee we present a theorem, a proof sketch grounded in the architectural invariants established in Sections \ref{sec:bailout-protocol} and \ref{sec:bailout-implementation}, and a discussion of what the guarantee does and does not cover.

% ----------------------------------------------------------------
\subsection{Preliminaries: Invariants}

We first state three structural invariants that hold for every trigger $t$ from the moment it fires until it reaches a terminal state. These invariants are the basis for all three guarantees.

\medskip
\noindent
\textbf{Invariant I1 (Mandatory Propagation).} For any trigger $t$ fired at node $n_0$ with Human Accountability Anchor $n_k$, every intermediate node $n_i$ in the chain $n_0, n_1, \ldots, n_{k-1}$ appends an \texttt{ESCALATED} ledger entry and forwards $t$ to its parent. No node in the chain may drop, suppress, or delay the propagation event $\sigma_{\text{prop}}$.

\medskip
\noindent
\textbf{Invariant I2 (Unique Anchor).} The \texttt{humanRoot} field is acyclic and deterministic: following parent pointers from any node terminates at a unique Human Accountability Anchor $n_k$, and $n_k.\texttt{humanRoot} = n_k.\texttt{nodeId}$.

\medskip
\noindent
\textbf{Invariant I3 (Immutable Ledger).} All state transitions of $t$ are recorded as append-only ledger entries sealed with SHA-256. The \texttt{prevHash} chain makes any retrospective modification to a historical entry detectable in $O(1)$ verification time via hash recomputation.

These invariants are enforced by the BX3 Framework's Fact Layer (Section \ref{sec:fact-layer-enforcement}) and are not dependent on the honesty of any individual node.

% ----------------------------------------------------------------
\subsection{SAFETY: No Autonomous Collapse}
\label{sec:safety-guarantee}

\begin{theorem}[SAFETY]
\label{th:safety}
During any transient state of a \texttt{BailoutTrigger} $t$, the action $a$ that fired $t$ cannot be executed by any Machine actor. Execution is blocked until $t$ reaches its terminal state.
\end{theorem}

\begin{IEEEproof}
The proof proceeds by case analysis on the trigger's lifecycle. Two enforcement mechanisms operate in concert.

\textbf{Mechanism 1: Sandbox Gate blocks execution.} The Sandbox Gate (Section \ref{sec:sandbox-gate}) is a pre-execution validation gate maintained by the Fact Layer. It is invoked on every \texttt{EXECUTE} request for any action $a$ that has an active trigger. The Fact Layer's \texttt{statusCheck} method queries the trigger's current state $q$. If $q \in \{$\texttt{BOUNDED}, \texttt{BAIL\_PENDING}, \texttt{ESCALATING}, \texttt{HUMAN\_ACKNOWLEDGED}$\}$, the gate returns \texttt{SANDBOX\_BLOCKED} and the \texttt{EXECUTE} request is denied. The key property is that the Sandbox Gate checks \emph{state}, not \emph{capability}: it does not evaluate whether the actor is technically able to execute $a$, only whether $t$ has been resolved.

\textbf{Mechanism 2: \texttt{resolve()} is human-only.} The only operation that transitions $t$ from any transient state to a terminal state is \texttt{resolve()}, which is invoked exclusively at the Human Accountability Anchor $n_k$. The Fact Layer enforces the human-only constraint on \texttt{resolve()} through the credential verification procedure described in Section \ref{sec:fact-layer-enforcement}: the \texttt{resolve()} call must carry a credential verifiable against the Human Root's public key. Machine actors do not hold credentials issued by the Human Root for this operation; therefore, no Machine actor can successfully call \texttt{resolve()}.

Consider the alternative: a Machine actor attempts to execute $a$ without calling \texttt{resolve()}. The Sandbox Gate blocks the \texttt{EXECUTE} request because $t$ is in a transient state. Now consider a Machine actor that attempts to call \texttt{resolve()} directly. The credential check fails because Machine actors are not issued Human Root credentials. Now consider a compromised node that rewrites its local state to claim $t$ is \texttt{RESOLVED}. By Invariant I3, the local state machine state must be consistent with the Forensic Ledger's hash chain. A rewritten claim would produce a ledger entry that fails the $O(1)$ hash verification at the anchor and at all monitoring nodes.

Since all three alternatives (unauthorized execution, unauthorized resolution, state falsification) are blocked by the joint operation of the Sandbox Gate, the human-only \texttt{resolve()} constraint, and the Immutable Ledger, the action $a$ cannot be autonomously executed while $t$ is in any transient state. $\square$
\end{IEEEproof}

\medskip
\noindent
\textbf{Discussion.} SAFETY does not guarantee that $a$ is never executed—it guarantees that $a$ is not executed autonomously. If the human reviews the trigger and issues a resolution authorizing $a$, execution proceeds through the \texttt{EXECUTE} path after $t$ reaches \texttt{RESOLVED}. SAFETY is a constraint on \emph{who} may execute, not a prohibition on execution itself.

SAFETY is also independent of the TTL. Even if the trigger times out (reaches \texttt{TIMEOUT}), the timeout is a terminal failure state, not a resolution. The action $a$ remains blocked; the timeout generates a \texttt{TRIGGER\_TIMEOUT} ledger entry and a distinct alert, but it does not authorize autonomous execution. This is the critical distinction between LIVENESS (which can be violated by non-responsiveness) and SAFETY (which cannot).

% ----------------------------------------------------------------
\subsection{LIVENESS: Eventual Human Contact}
\label{sec:liveness-guarantee}

\begin{theorem}[LIVENESS]
\label{th:liveness}
For any trigger $t$ fired at node $n_0$, if the Human Accountability Anchor $n_k$ is reachable in the node hierarchy and the TTL does not expire, then $t$ reaches state \texttt{ESCALATING} (human notified) and state \texttt{HUMAN\_ACKNOWLEDGED} (human acknowledges) within a bounded number of state transitions.
\end theorem}

\begin{IEEEproof}
The proof has two parts: reachability of the anchor, and bounded progress through transient states.

\textbf{Part 1: Anchor reachability.} By Invariant I2, the \texttt{humanRoot} field is acyclic and deterministic. The parent relation forms a rooted tree (no cycles) with the Human Accountability Anchor $n_k$ as the unique root. For any node $n_0$, there exists a finite path $n_0, n_1, \ldots, n_k$ where each $n_{i+1} = n_i.\texttt{parent}$ and $n_k.\texttt{nodeId} = n_k.\texttt{humanRoot}$. This path is guaranteed to exist because the parent relation is total and acyclic at the Purpose Layer (enforced by BX3's hierarchical governance model, Pillar P2). There is no node that can point to a parent outside the hierarchy or create a cycle.

\textbf{Part 2: Bounded progress through transient states.} We examine each transition in the escalation path:

\begin{enumerate}
  \item[\textbf{Step 1}] $\sigma_{\text{fire}}$ fires at $n_0$. By the protocol definition (Section \ref{sec:state-machine}), this transitions $t$ from \texttt{IDLE} to \texttt{BOUNDED} unconditionally. No preconditions can prevent this transition; the trigger condition match is sufficient.
  \item[\textbf{Step 2}] The while-loop in Algorithm \ref{alg:escalation} executes at each node $n_i$ for $i = 0, 1, \ldots, k-1$. Each iteration emits $\sigma_{\text{prop}}$ and transitions $t$ to \texttt{BAIL\_PENDING}, appends the \texttt{ESCALATED} ledger entry, and moves to $n_{i+1}$. By Invariant I1, $n_i$ cannot skip this step. The loop terminates after exactly $k$ iterations when $n_i = n_k$.
  \item[\textbf{Step 3}] At $n_k$, $\sigma_{\text{arrive}}$ fires. Since $n_k$ is the anchor by definition of the loop termination condition, $\sigma_{\text{arrive}}$ is emitted unconditionally, transitioning $t$ to \texttt{ESCALATING}. The \texttt{SurfaceAlert} operation (Section \ref{sec:escalation}) is invoked, which delivers notification to the human.
  \item[\textbf{Step 4}] Upon human acknowledgment, $\sigma_{\text{ack}}$ fires, transitioning $t$ to \texttt{HUMAN\_ACKNOWLEDGED}. This step requires human action; it is bounded by the TTL. If the human does not respond before the TTL expires, $\sigma_{\text{ttl}}$ fires and $t$ enters \texttt{TIMEOUT} instead.
\end{enumerate}

The total number of state transitions from firing to potential human acknowledgment is bounded by $2k + 2$, where $k$ is the depth of $n_0$ in the hierarchy. Since $k$ is finite for any node in a rooted tree and the TTL is finite, the bound is finite. Therefore, if the anchor is reachable and the TTL does not expire, $t$ reaches \texttt{HUMAN\_ACKNOWLEDGED} within a bounded number of transitions. $\square$
\end{IEEEproof}

\medskip
\noindent
\textbf{Discussion.} LIVENESS has two preconditions: (1) the anchor must be reachable in the node hierarchy, and (2) the TTL must not expire. Both preconditions are satisfied in normal operation. Precondition (1) is a deployment-time structural property of the BX3 Framework; if a node were deployed without a valid \texttt{humanRoot}, it would fail initialization. Precondition (2) depends on human responsiveness and is the weaker of the two preconditions.

The distinction between SAFETY and LIVENESS is now precise: SAFETY holds regardless of the TTL because it constrains what may happen during transient states. LIVENESS can be violated if the human does not respond within the TTL, but this violation is bounded and recorded—violation of LIVENESS does not imply violation of SAFETY. A timed-out trigger enters \texttt{TIMEOUT}, which is a failure state, not a resolution. The system fails safe, not autonomously.

% ----------------------------------------------------------------
\subsection{ACCOUNTABILITY: Human Always Identifiable}
\label{sec:accountability-guarantee}

\begin{IEEEproof}[ACCOUNTABILITY]
\label{th:accountability}
For any action $a$ executed by a BX3 node that was authorized by a \texttt{BailoutTrigger} resolution, the identity of the human who issued the resolution is uniquely recorded in the Forensic Ledger and is computationally attributable to that human with non-repudiation.
\medskip

\noindent
\textbf{Proof.} The proof traces the accountability chain from the resolution event backward to the human's identity.

\textbf{Step 1: The resolution is anchored to a credential.} When the human issues a resolution at the Human Accountability Anchor $n_k$, the \texttt{resolve()} operation is invoked with a credential $C$ issued by the Human Root. The Fact Layer's \texttt{verify()} method verifies $C$ against the Human Root's public key $K_{\text{pub}}$ stored at the Purpose Layer. By BX3's credential issuance policy (Pillar P2, Recursive Spawning), $K_{\text{pub}}$ is unique to the human and is issued at the moment the Human Accountability Anchor is established. Therefore, successful verification of $C$ against $K_{\text{pub}}$ establishes that the resolution was issued by the holder of the corresponding private key.

\textbf{Step 2: The resolution is recorded immutably.} By Invariant I3, the resolution is recorded as a \texttt{RESOLUTION\_RECORDED} ledger entry that includes the hash of $C$, the resolved action $a$, the resolution verdict (authorize or deny), and the timestamp. This entry is sealed with SHA-256 and chained to the preceding entry via \texttt{prevHash}. Because the chain is append-only and the hash of the credential (not the credential itself) is recorded, the ledger does not expose the credential while still making the resolution event tamper-evident.

\textbf{Step 3: The propagation chain links $a$ to $n_0$.} The \texttt{BailoutTrigger} payload includes a \texttt{propagationChain} field (Algorithm \ref{alg:escalation}) that records every node $n_i$ that witnessed the trigger's propagation from $n_0$ to $n_k$. The chain is written at each $\sigma_{\text{prop}}$ event and sealed in the ledger. Any downstream audit can trace $t$ from $n_0$ (where $a$ originated) to $n_k$ (where the resolution was issued), establishing a complete chain of custody.

\textbf{Step 4: The human is non-repudiable.} The combination of (a) the credential verification step, which ties the resolution to a specific private key holder, and (b) the immutable ledger entry, which records this tie without revealing the credential, produces non-repudiation: the human cannot deny having issued the resolution because the credential was verified; no other party could have produced it. The auditor cannot alter the ledger to fabricate a resolution or alter an existing one without breaking the SHA-256 chain (Invariant I3), so the record is tamper-evident.

The human is therefore uniquely and verifiably identifiable for every action $a$ that was executed under a Bailout Protocol resolution. $\square$
\end{IEEEproof}

\medskip
\noindent
\textbf{Discussion.} The ACCOUNTABILITY guarantee is stronger than identification alone. It provides \emph{attribution with non-repudiation}: not only can we determine which human resolved the trigger, but the human cannot credibly deny having done so, and the record cannot be altered retrospectively. This property is essential for regulatory compliance, incident response, and organizational governance.

ACCOUNTABILITY holds for all actions $a$ that were executed following a Bailout Protocol resolution. It does not hold for actions executed when no trigger was fired—this is outside the scope of the Bailout Protocol and is addressed by other BX3 Framework guarantees (specifically, the Fact Layer's general action attribution). It also does not hold if the trigger reached \texttt{TIMEOUT}, because no resolution was issued; in this case, the \texttt{TRIGGER\_TIMEOUT} entry records the absence of resolution, which is itself an accountability record of a failure condition.

% ----------------------------------------------------------------
\subsection{Summary of Guarantees}
\label{sec:guarantee-summary}

Table \ref{tab:guarantees} summarizes the three guarantees, their formal statements, the architectural mechanisms that enforce them, and their dependency on the TTL.

\medskip
\noindent
\begin{tabular}{p{2.2cm}p{4.2cm}p{4.0cm}p{2.2cm}}
  \hline
  \textbf{Guarantee} & \textbf{Statement} & \textbf{Enforcement Mechanism} & \textbf{TTL Dependent?} \\
  \hline
  SAFETY & No autonomous execution during any transient state & Sandbox Gate + human-only \texttt{resolve()} + Immutable Ledger & No \\
  LIVENESS & Eventual human contact if anchor reachable and TTL does not expire & Mandatory propagation (Invariant I1) + acyclic parent tree (Invariant I2) & Yes \\
  ACCOUNTABILITY & Human who resolved $t$ is uniquely identifiable with non-repudiation & Credential verification at \texttt{resolve()} + immutable propagation chain in Forensic Ledger & No \\
  \hline
\end{tabular}
\medskip

\caption{Guarantee summary for the Bailout Protocol.}
\label{tab:guarantees}

The three guarantees are mutually independent in the sense that each can be formally proven from the architectural invariants without assuming the others. They are architecturally interdependent in practice: SAFETY relies on the human-only \texttt{resolve()} constraint, which is the same constraint that makes ACCOUNTABILITY possible; LIVENESS relies on the propagation structure, which produces the chain of custody that ACCOUNTABILITY requires. This interdependence is a design feature: the three guarantees together form a unified accountability architecture, not three separate mechanisms.

\medskip
\noindent
\textbf{Remark on Compromise.} If any of the three invariants (I1, I2, I3) is violated, the corresponding guarantee may no longer hold. Violation of I1 (mandatory propagation) compromises LIVENESS because the trigger may not reach the anchor. Violation of I2 (unique anchor) compromises both LIVENESS and ACCOUNTABILITY because the propagation target becomes ambiguous. Violation of I3 (immutable ledger) compromises both SAFETY and ACCOUNTABILITY because the state machine's history becomes falsifiable. The BX3 Framework's Fact Layer is responsible for maintaining all three invariants; if the Fact Layer itself is compromised, the guarantees degrade to the trustworthiness of the remaining honest nodes in the hierarchy—a condition that is outside the scope of the protocol's formal correctness guarantees and is addressed by BX3's Byzantine fault tolerance provisions (Section \ref{sec:byzantine}).
