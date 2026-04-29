% ---------------------------------------------------------------
% Section 3 — The Bailout Protocol
% Paper: Bailout Protocol: Mandatory Human Accountability in Multi-Agent Systems
% ---------------------------------------------------------------

\section{The Bailout Protocol}
\label{sec:bailout-protocol}

The Bailout Protocol is a deterministic, architecture-level procedure that enforces mandatory human escalation in any autonomous multi-agent system implementing the BX3 Framework. It is not an error handler. It is not a fallback mode. It is a structural guarantee: a commitment embedded in the system architecture that \emph{certain conditions obligatorily require a human decision before any autonomous action may proceed.}

This section defines the protocol formally. We specify the state machine governing every trigger's lifecycle (\ref{sec:state-machine}), the three conditions that obligatorily fire a trigger (\ref{sec:trigger-conditions}), the escalation algorithm that propagates triggers to the Human Accountability Anchor (\ref{sec:escalation}), the bypass mechanism that makes escalation unconditionally deterministic (\ref{sec:bypass}), and the timeout handling that prevents indefinite suspension (\ref{sec:timeout}).

% ----------------------------------------------------------------
\subsection{State Machine}
\label{sec:state-machine}

Each bail-out event—a \texttt{BailoutTrigger}—is governed by a deterministic finite state machine (DFSM) with six mutually exclusive states. The state encodes the trigger's position in the accountability chain and determines which operations are permitted at any given time.

\subsubsection{State Definitions}

\medskip
\noindent
\begin{tabular}{clp{8.5cm}}
  \hline
  \textbf{State} & \textbf{Plane} & \textbf{Semantics} \\
  \hline
  \texttt{IDLE} & $-$ & No trigger is active. The node is operating normally. \\
  \texttt{BOUNDED} & P1 & A condition has been detected that may require escalation.
                           The trigger is authored and sealed; propagation has not begun. \\
  \texttt{BAIL\_PENDING} & P3–P4 & The trigger is propagating upward through the
                           parent chain. Intermediate nodes are appending witness records. \\
  \texttt{ESCALATING} & P5 & The trigger has arrived at the Human Accountability Anchor.
                           The human has been notified; acknowledgment is pending. \\
  \texttt{HUMAN\_ACKNOWLEDGED} & P7 & The human has acknowledged the trigger and is
                           actively reviewing or has issued a resolution. \\
  \texttt{RESOLVED} & P8 & The trigger has a recorded resolution. Protocol is complete. \\
  \hline
\end{tabular}
\medskip

The state \texttt{IDLE} is the initial and terminal state. All other states are transient—the protocol is designed to exit them, not linger in them. \texttt{RESOLVED} is the only successful terminal state.

A seventh pseudo-state \texttt{TIMEOUT} (Plane P9) may be entered from any of the transient states \texttt{BOUNDED}, \texttt{BAIL\_PENDING}, \texttt{ESCALATING}, or \texttt{HUMAN\_ACKNOWLEDGED} when the TTL expires. It is a terminal failure state distinct from \texttt{RESOLVED}.

\subsubsection{State Transition Function}

The transition function $\delta: Q \times \Sigma \rightarrow Q$ is defined over the state set $Q = \{$ \texttt{IDLE}, \texttt{BOUNDED}, \texttt{BAIL\_PENDING}, \texttt{ESCALATING}, \texttt{HUMAN\_ACKNOWLEDGED}, \texttt{RESOLVED}, \texttt{TIMEOUT} $\}$ and the event alphabet $\Sigma$ defined in Table~\ref{tab:events}.

\medskip
\noindent
\begin{tabular}{clp{7cm}}
  \hline
  \textbf{Symbol} & \textbf{Event} & \textbf{Condition for firing} \\
  \hline
  $\sigma_{\text{fire}}$ & \texttt{TRIGGER\_FIRED} & Trigger condition met (Section~\ref{sec:trigger-conditions}) \\
  $\sigma_{\text{prop}}$ & \texttt{PROPAGATE} & Current node is not the Human Accountability Anchor \\
  $\sigma_{\text{arrive}}$ & \texttt{ARRIVE} & Current node is the Human Accountability Anchor \\
  $\sigma_{\text{ack}}$ & \texttt{HUMAN\_ACK} & Human has acknowledged the notification \\
  $\sigma_{\text{resolve}}$ & \texttt{RESOLVE} & Human has issued a binding resolution \\
  $\sigma_{\text{ttl}}$ & \texttt{TTL\_EXPIRED} & Elapsed time exceeds the configured TTL \\
  \hline
\end{tabular}
\label{tab:events}
\medskip

The transition function is:

\begin{equation}
\delta(q, \sigma) =
\begin{cases}
\texttt{BOUNDED}           & \text{if } q = \texttt{IDLE} \land \sigma = \sigma_{\text{fire}} \\
\texttt{BAIL\_PENDING}     & \text{if } q = \texttt{BOUNDED} \land \sigma = \sigma_{\text{prop}} \\
\texttt{ESCALATING}        & \text{if } q = \texttt{BAIL\_PENDING} \land \sigma = \sigma_{\text{arrive}} \\
\texttt{HUMAN\_ACKNOWLEDGED} & \text{if } q = \texttt{ESCALATING} \land \sigma = \sigma_{\text{ack}} \\
\texttt{RESOLVED}          & \text{if } q = \texttt{HUMAN\_ACKNOWLEDGED} \land \sigma = \sigma_{\text{resolve}} \\
\texttt{TIMEOUT}           & \text{if } q \in \{\texttt{BOUNDED}, \texttt{BAIL\_PENDING},
                              \texttt{ESCALATING}, \texttt{HUMAN\_ACKNOWLEDGED}\} \land \sigma = \sigma_{\text{ttl}} \\
q                          & \text{otherwise (no transition on unrecognized event)}
\end{cases}
\label{eq:transition}
\end{equation}

The transition function is total: every state-event pair maps to exactly one next state, or leaves the machine unchanged if the event is not valid for the current state. The machine is deterministic by construction.

\medskip
\noindent
\textbf{Transition Invariants.}
The following invariants hold for all valid executions of the state machine:

\begin{itemize}
  \item \textbf{I1 (Finite Chain):} The propagation chain $\langle n_0, n_1, \ldots, n_k \rangle$ is strictly ascending in the parent relation; no node appears twice.
  \item \textbf{I2 (Anchor Reachability):} The chain terminates at $n_k$ where $n_k.\texttt{nodeId}$ is the Human Accountability Anchor credential.
  \item \textbf{I3 (Irreversibility):} Transitions $\sigma_{\text{prop}}$, $\sigma_{\text{arrive}}$, $\sigma_{\text{ack}}$, and $\sigma_{\text{resolve}}$ are monotonic in the chain—each advances the trigger strictly closer to the anchor.
\end{itemize}

% ----------------------------------------------------------------
\subsection{Bail-Out Trigger Conditions}
\label{sec:trigger-conditions}

A \texttt{BailoutTrigger} is fired when the Bounds Engine evaluates a proposed action $p$ at a node $n$ and finds that one of three conditions holds. Each condition is necessary and sufficient to fire the trigger; all three are evaluated in a fixed order before any autonomous execution may proceed.

\begin{enumerate}
  \item[\textbf{C1}] \textbf{Capability Boundary (\texttt{capability\_boundary}):}
        The proposed action $a$ is outside the node's declared capability set $\texttt{capabilitySet}$.
        Formally: $\exists a \in A$ such that proposal $p$ requires $a$, and $\texttt{capabilityCheck}(a, \texttt{capabilitySet}) = \texttt{false}$.

  \item[\textbf{C2}] \textbf{Safety Envelope Violation, Predicted (\texttt{safety\_envelope\_predicted}):}
        The bounded-reasoning engine has projected the execution of $p$ forward in time and forecast that $p$'s execution will cause the system to exit its declared \texttt{SafetyEnvelope} at time $t + \Delta$ for some $\Delta > 0$.
        Formally: $\texttt{project}(p, \texttt{safetyEnvelope}) = \texttt{Violation}$ with confidence $c \geq \tau$, where $\tau$ is the minimum confidence threshold (typically $0.7$).

  \item[\textbf{C3}] \textbf{Accountability Boundary (\texttt{accountability\_boundary}):}
        The proposed action $p$ is within the node's capability set and does not violate the safety envelope in projection, but the governance policy declares that actions of this class require explicit human authorization regardless of technical feasibility.
        Formally: $\texttt{capabilityCheck}(a, \texttt{capabilitySet}) = \texttt{true} \land \texttt{project}(p, \texttt{safetyEnvelope}) \neq \texttt{Violation} \land \texttt{policyCheck}(a) = \texttt{HUMAN\_REQUIRED}$.
\end{enumerate}

\medskip
\noindent
\textbf{Evaluation Order.} The three conditions are evaluated in the fixed sequence C1 $\rightarrow$ C2 $\rightarrow$ C3. A match on any condition fires the trigger immediately; subsequent conditions are not evaluated. The matched condition is recorded as an immutable \texttt{triggerCondition} field in the \texttt{BailoutTrigger} payload, sealed at the moment of firing. This immutability is enforced by the Fact Layer's SHA-256 sealing mechanism (Pillar 3 of the BX3 Framework).

The evaluation order is not arbitrary: C1 (capability) is evaluated first because it represents the most fundamental constraint—an agent cannot execute an action it is not capable of executing. C2 (safety) is evaluated second because it represents a forecast of physical or systemic harm. C3 (accountability) is evaluated last because it is a governance-level override that applies only when the technical preconditions are satisfied.

% ----------------------------------------------------------------
\subsection{Escalation Algorithm}
\label{sec:escalation}

When a trigger fires ($\texttt{IDLE} \rightarrow \texttt{BOUNDED}$), the protocol executes the Escalation Algorithm to transport the trigger to the Human Accountability Anchor. The algorithm is defined as a bounded loop over the node hierarchy.

\begin{algorithm}
\caption{Escalation Algorithm}
\label{alg:escalation}
\begin{algorithmic}[1]
\Statex
\Procedure{Escalate}{$t$, $n$}
  \State $\texttt{firedAt} \gets \Call{Now}{}$
  \State $\Call{Transition}{t, \sigma_{\text{fire}}}$
  \State $\Call{AppendLedger}{t, \texttt{TRIGGER\_FIRED}, n}$
  \State $t.\texttt{propagationChain} \gets [\,]$
  \State $t.\texttt{propagationChain}.\texttt{append}(n.\texttt{nodeId})$

  \While{$n.\texttt{nodeId} \neq n.\texttt{humanRoot}$}
    \State $\Call{Transition}{t, \sigma_{\text{prop}}}$
    \State $\Call{AppendLedger}{t, \texttt{ESCALATED}, n}$
    \State $n \gets n.\texttt{parent}$
    \State $t.\texttt{propagationChain}.\texttt{append}(n.\texttt{nodeId})$
  \EndWhile

  \State $\Call{Transition}{t, \sigma_{\text{arrive}}}$
  \State $\Call{AppendLedger}{t, \texttt{HUMAN\_REVIEW}, n}$
  \State $\Call{SurfaceAlert}{t, \texttt{ESCALATING}}$
\EndProcedure
\end{algorithmic}
\end{algorithm}

\medskip
\noindent
\textbf{Correctness of the Escalation Loop.}

The loop invariant at the start of each iteration is:

\begin{itemize}
  \item $n$ is a node in the propagation chain of $t$.
  \item $t.\texttt{propagationChain}$ contains the node IDs of all nodes that have received $t$ up to and including the current node.
  \item $t.\texttt{status} = \texttt{BAIL\_PENDING}$.
\end{itemize}

The invariant is established by the initialization steps before the loop and preserved by each iteration, which appends the parent node to the chain and advances $n$ upward. The loop terminates when $n.\texttt{nodeId} = n.\texttt{humanRoot}$, which is guaranteed to occur by Invariant I2 (the chain terminates at the anchor). Because the chain is strictly ascending and finite (I1), the loop terminates after exactly $k$ iterations where $k$ is the depth of the originating node in the hierarchy.

After loop termination, the anchor $n_k$ appends a \texttt{HUMAN\_REVIEW} ledger entry, transitions the trigger to \texttt{ESCALATING}, and surfaces an alert. The human is now obligated to acknowledge the trigger.

% ----------------------------------------------------------------
\subsection{Bypass Mechanism}
\label{sec:bypass}

The bypass mechanism is the structural property that makes the Bailout Protocol's escalation unconditionally deterministic: the trigger bypasses all intermediate Machine actors and arrives at the Human Accountability Anchor regardless of the behavior of any node in the hierarchy.

\medskip
\noindent
\textbf{Definition (Bypass).} A trigger $t$ originated at node $n_0$ bypasses an intermediate node $n_i$ if the execution of Algorithm~\ref{alg:escalation} ensures that $t$ arrives at the Human Accountability Anchor $n_k$ regardless of the internal state, behavior, or compromise of $n_i$ for all $0 \leq i < k$.

\medskip
\noindent
\textbf{Theorem (Bypass Guarantee).} The escalation of any \texttt{BailoutTrigger} $t$ from any originating node $n_0$ to the Human Accountability Anchor $n_k$ is guaranteed to complete, and $n_k$ is guaranteed to receive $t$, under the following assumptions:
\begin{enumerate}
  \item The node hierarchy is static (parent relations do not change during escalation).
  \item The Fact Layer's append-only ledger is available at every node.
  \item The Human Accountability Anchor $n_k$ is reachable from $n_0$ via the parent chain.
\end{enumerate}

\begin{IEEEproof}
The proof follows directly from Algorithm~\ref{alg:escalation}. The algorithm emits the $\sigma_{\text{prop}}$ event as an unconditional step at each intermediate node $n_i$. This event is generated by the node's own Bounds Engine as part of the escalation loop—it is not a message that can be declined or suppressed by the intermediate node. The intermediate node's sole role is to append its witness record and forward the trigger upward; it cannot prevent the forwarding.

Even if an intermediate node is compromised and its local state is altered, the trigger record at $n_0$ and the anchor's \texttt{HUMAN\_REVIEW} entry at $n_k$ are written independently. The monitoring layer can detect a missing intermediate entry via ledger gap analysis. A gap—where an expected \texttt{ESCALATED} entry at node $n_i$ is absent—is a detectable anomaly that violates Invariant I1.

The anchor's receipt of $t$ is therefore guaranteed not by the honesty of intermediate nodes but by the cryptographic structure of the ledger and the atomicity of the $\sigma_{\text{prop}}$ emission. $\square$
\end{IEEEproof}

The bypass mechanism has two structural consequences:

\begin{enumerate}
  \item \textbf{The trigger cannot be suppressed.} The $\sigma_{\text{prop}}$ event is emitted by the node itself as part of the escalation loop. The loop does not offer a conditional skip—every non-anchor node \emph{must} forward. A node that declines to forward is in violation of Invariant I1, and the gap in the propagation chain is detectable by the monitoring layer.
  \item \textbf{Recursive delegation cannot escape accountability.} An agent that spawns a sub-agent and delegates a task cannot escape accountability by claiming the sub-agent acted independently. The sub-agent's trigger propagates through the delegation chain until it reaches the human at the root.
\end{enumerate}

The bypass is therefore not a property of any individual node's honesty—it is a structural property of the architecture. It survives recursive delegation because the delegation chain is encoded in the node hierarchy, and the escalation loop follows the parent relation deterministically.

% ----------------------------------------------------------------
\subsection{Timeout Handling}
\label{sec:timeout}

The timeout mechanism prevents a trigger from occupying any transient state indefinitely. Every trigger carries a time-to-live (\texttt{ttl}) field set at the moment of firing.

\begin{definition}[TTL]\label{def:ttl}
  For a trigger $t$ with \texttt{firedAt} timestamp $t_s$ and TTL duration $d_{\text{ttl}}$, the \texttt{deadline} is $t_s + d_{\text{ttl}}$. The event $\sigma_{\text{ttl}}$ fires at the first clock tick $c$ such that $c \geq t_s + d_{\text{ttl}}$.
\end{definition}

The TTL is evaluated at every state transition. If the deadline passes while the trigger is in any transient state, the machine transitions to \texttt{TIMEOUT}:

\begin{equation}
\forall q \in \{\texttt{BOUNDED}, \texttt{BAIL\_PENDING}, \texttt{ESCALATING}, \texttt{HUMAN\_ACKNOWLEDGED}\}:
\quad \delta(q, \sigma_{\text{ttl}}) = \texttt{TIMEOUT}
\end{equation}

The \texttt{TIMEOUT} state produces a \texttt{TRIGGER\_TIMEOUT} ledger entry and is treated as a distinct failure event. Reaching \texttt{TIMEOUT} does not resolve the underlying condition that triggered the bail-out—it records that the human accountability path could not be completed within the allocated time.

\begin{algorithm}
\caption{TTL Monitoring Loop (per trigger)}
\label{alg:ttl}
\begin{algorithmic}[1]
\Statex
\Procedure{MonitorTTL}{$t$}
  \While{$t.\text{status} \notin \{\texttt{RESOLVED}, \texttt{TIMEOUT}\}$}
    \State $\Delta \gets \Call{Now}{} - t.\text{firedAt}$
    \If{$\Delta \geq t.\text{ttl}$}
      \State $\Call{Transition}{t, \sigma_{\text{ttl}}}$
      \State $\Call{AppendLedger}{t, \texttt{TRIGGER\_TIMEOUT}, \Call{NodeOf}{t}}$
      \State $\Call{SurfaceAlert}{t, \texttt{TIMEOUT}}$
      \State \Return
    \EndIf
    \State $\Call{Sleep}{$1\, \text{second}$}
  \EndWhile
\EndProcedure
\end{algorithmic}

\medskip
\noindent
\textbf{TTL Configuration.} The TTL is a deployment parameter, not a protocol constant. Recommended defaults: $300\,$s (5 minutes) for synchronous operational environments; $3600\,$s (1 hour) for human-in-the-loop workflows with asynchronous availability. The TTL should be set by the system operator at deployment time and is recorded in the Purpose Layer's \texttt{config} field for auditability.

\medskip
\noindent
\textbf{TTL and Human Latency.} The timeout does not relieve the human of their obligation to resolve the trigger. \texttt{TIMEOUT} records that the deadline elapsed; it does not retroactively authorize autonomous resolution. A timed-out trigger remains ungoverned by the human—it enters a failure state that requires operational intervention. This preserves the SAFETY guarantee even when the LIVENESS guarantee is violated by human non-response.

\medskip
\noindent
\textbf{Deadline Extension.} The protocol does not include a mechanism for extending the TTL after firing. Extending a running deadline would create an exploitable channel: a compromised intermediate node could repeatedly extend the TTL to indefinitely postpone human review. If a longer window is required, the operator must resolve the trigger and re-issue a new task with a different TTL. This design choice is a deliberate trade-off: liveliness is sacrificed in favor of non-manipulability.
