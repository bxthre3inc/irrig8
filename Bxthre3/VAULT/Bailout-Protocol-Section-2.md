\section{Background}

The deployment of autonomous multi-agent systems in high-stakes environments — irrigation, manufacturing, clinical decision support, and defense — has exposed a fundamental architectural gap: none of the prevailing governance frameworks ensure that human accountability survives recursion, delegation, or network disconnection. This section reviews the prior art across three domains that converge in the Bailout Protocol: accountability in multi-agent AI systems (\S\ref{sec:accountability}), human-in-the-loop design principles (\S\ref{sec:hitl}), and fail-safe design in safety-critical systems (\S\ref{sec:failsafe}). We then situate the BX3 Framework's three-layer model as the structural answer to the failure modes identified in each domain.

\subsection{Accountability in Multi-Agent AI Systems}
\label{sec:accountability}

The problem of accountability in autonomous systems is not new. Norbert Wiener identified the core tension in 1948: machines that act autonomously produce consequences that cannot be traced back to a human decision-maker \cite{wiener1948}. As autonomous systems grew in complexity, this traceability problem compounded. A single high-level decision propagated through a recursive hierarchy of sub-agents becomes effectively untraceable if the hierarchy itself does not enforce a structured accountability chain.

Dijkstra's early work on structured programming established a foundational principle: reasoning about a system requires decomposability along clean architectural boundaries \cite{dijkstra1982}. When applied to multi-agent systems, this principle demands that each agent's decision space be bounded and that the authority chain between agents be explicitly maintained. Without such boundaries, an agent's actions propagate downward through its children, and the original authorization — the human decision that legitimized the action — becomes obscured by layers of autonomous reasoning.

The challenge intensifies in systems where agents spawn sub-agents that inherit parent authority. Tristrata's concept of open distributed systems described a class of architectures where trust propagation and delegation are structurally unavoidable \cite{tristr81}. In such systems, accountability is not merely a policy requirement; it is an architectural property that must be embedded in the delegation mechanism itself. If a child agent inherits its parent's authority, and that parent inherited authority from a human, then the chain of accountability must survive the entire propagation — not as a hope, but as a structural guarantee.

Prior approaches to accountability in multi-agent systems have focused primarily on logging and audit trails. Bansal et al. surveyed the landscape of AI safety and identified that accountability mechanisms in deployed autonomous systems are overwhelmingly post-hoc: they record what happened but do not structurally prevent the severance of human oversight during critical decision cycles \cite{bansal2019}. This observation is the architectural starting point for the Bailout Protocol. Post-hoc logging is necessary but insufficient. A system that records its decisions after they are executed cannot guarantee that a human was ever in the loop at the moment decisions were made.

The accountability gap becomes most dangerous in three operational scenarios that the BX3 Framework explicitly targets:

\textbf{Recursive spawning.} When a parent agent births a child with inherited authority, the accountability chain from parent to child must be structurally maintained. If the child encounters a condition beyond its capability boundary and propagates an exception upward, the exception must reach a Human Accountability Anchor — not merely any human, but the specific human whose authority initiated the chain.

\textbf{Delegation.} When authority is delegated across a hierarchy, the delegator retains residual accountability. In conventional systems, this retention is a policy assumption, not an architectural enforcement. A system that relies on policy-level accountability assumptions in a hierarchy of autonomous agents is structurally vulnerable to the scenario where the delegation chain is broken by a malfunctioning intermediate agent.

\textbf{Cloud disconnection.} Edge-deployed autonomous systems frequently operate without cloud connectivity. In such conditions, the child's local reasoning engine operates in isolation. The human who authorized the parent agent's policy may be unreachable. Conventional architectures resolve this by granting the edge node full autonomous authority during disconnection — a design choice that severs accountability precisely when the system is most autonomous.

These three scenarios are not hypothetical. They are daily operational realities in deployed autonomous systems. The Bailout Protocol is an architectural response to all three simultaneously.

\subsection{Human-in-the-Loop Design}
\label{sec:hitl}

Human-in-the-loop (HITL) design is the dominant paradigm for maintaining human oversight in autonomous systems. At its core, HITL requires that certain decision categories require human authorization before execution. The paradigm has been successful in constraining the autonomy of individual agents operating in defined decision spaces.

However, the prevailing HITL implementations share a common architectural limitation: human authorization is treated as a \emph{checkpoint} within an agent's execution pipeline, not as a \emph{structural termination point} for the entire decision chain. In typical HITL architectures, a human is consulted at a defined stage — for example, after the agent proposes an action but before the agent executes it. If the agent's reasoning chain is broken, compromised, or recursion-burdened, the HITL checkpoint may fire correctly but the resolution may not propagate correctly back to the originating node.

More critically, conventional HITL implementations assume that the human is reachable at the moment the checkpoint is reached. In edge-deployed systems operating in cloud-disconnected environments, this assumption fails. The HITL checkpoint fires, the system waits for human authorization, and the wait becomes indefinite — or worse, the system falls back to autonomous execution because the human is unreachable.

Dijkstra's insistence on structured reasoning about programs extends directly to HITL design: a human-in-the-loop is only as reliable as the mechanism by which it is invoked \cite{dijkstra1982}. If the invocation mechanism is a network call that depends on cloud connectivity, then the HITL guarantee degrades to a best-effort property. Best-effort human oversight is not a safety guarantee — it is a aspiration.

The BX3 Framework addresses this gap by distinguishing between two categories of human involvement:

\textbf{Human as Purpose layer anchor (structural).} The Human Accountability Anchor is not a checkpoint in an execution pipeline. It is the authoritative origin of the entire purpose chain. Every node in the hierarchy carries a hard-coded, immutable pointer to this anchor. The pointer is sealed at instantiation and propagated to all descendants through the \texttt{parentPurposeHash} mechanism. This is not a network call — it is a structural property of the node's architecture.

\textbf{Human as resolution authority (mandatory).} When a node encounters an unresolvable condition, it does not make a best-effort attempt to contact the human. It propagates the exception upward through the parent chain until it reaches the Human Accountability Anchor. This propagation is mandatory and non-bypassable: the trigger bypasses all intermediate Machine actors. The node does not fall back to autonomous execution. It halts and waits.

This architectural distinction is the core contribution of the Bailout Protocol. HITL as a paradigm is correct; HITL as conventionally implemented is insufficient. The Bailout Protocol converts HITL from a checkpoint-based policy into a structural, non-optional property of the system architecture.

The Training Wheels Protocol \cite{bansal2019} provides the graduated autonomy model that complements the Bailout Protocol's escalation structure. Under Training Wheels, all BX3 nodes operate in Mode 1 (HITL Active) by default: every outbound action is queued for human review before execution. Autonomy is earned, not assumed, and the system automatically downgrades to Mode 1 on any rejection or error. The Bailout Protocol provides the escalation path when HITL Active is insufficient; Training Wheels provides the graduated autonomy model that determines when HITL Active is appropriate.

\subsection{Fail-Safe Design in Safety-Critical Systems}
\label{sec:failsafe}

The concept of fail-safe design originates in control systems engineering, where the failure of a component must not result in a state that is more dangerous than the system's baseline condition \cite{tristr81}. A fail-safe system is one in which the default state — the state entered upon component failure — is the safest possible state, not the most convenient one.

Applied to multi-agent AI systems, fail-safe design requires that when an agent encounters a condition it cannot resolve, the system enters a safe state rather than continuing autonomous execution. The safe state is not merely "pause and wait." It is a structurally defined state in which the agent's authority is held, no physical actions are executed, and the exception is propagated to a Human Accountability Anchor through a defined, non-bypassable path.

The challenge in applying fail-safe principles to AI systems is that the "safe state" is context-dependent and must be defined at the Purpose layer, not at the execution layer. A system that defines "safe state = pause" without defining who receives the pause notification and what resolution path is available has not implemented fail-safe design — it has implemented fail-secure logging.

Wiener's analysis of cybernetic systems anticipated this problem: a system that acts in the physical world requires not just feedback, but \emph{corrective feedback} — information that enables a responsible actor to intervene and correct the system's trajectory \cite{wiener1948}. Fail-safe design in autonomous AI requires that the system not only enter a safe state upon failure, but that it communicate the failure to a responsible actor through a path that cannot be blocked by any agent in the hierarchy.

The Bailout Protocol's three trigger conditions operationalize this requirement:

\textbf{Capability Boundary (CB).} The node encounters a condition outside its defined capability range. It cannot propose a resolution that satisfies its governing policy. Rather than guessing or defaulting to autonomous execution, it halts and triggers.

\textbf{Safety Envelope Violation — Predicted (SEV-P).} The Bounds Engine's projection sandbox simulates the outcome of a proposed execution and detects that the outcome would violate the Safety Envelope parameters. The violation is predicted, not observed — the system halts before the unsafe action is executed. This is the predictive fail-safe property.

\textbf{Accountability Boundary Violation (ABV).} The node detects that the action it has been asked to execute would cross an accountability boundary it cannot resolve — for example, an action whose consequences would terminate the traceability chain between the current node and the Human Accountability Anchor.

These three conditions are not error codes. They are architectural states that trigger mandatory, non-bypassable escalation. The system does not "handle" these conditions — it escalates them. This is the distinction between fail-safe design and error handling. Error handling is local and optional. Fail-safe escalation is structural and mandatory.

The BX3 Framework's 9-Plane Deterministic Architecture Protocol (DAP) provides the orthogonal plane structure that makes fail-safe escalation architecturally enforceable \cite{bansal2019}. By decomposing every system event into nine discrete planes — Purpose (Past/Present/Future), Bounds Engine (Past/Present/Future), and Fact (Past/Present/Future) — the DAP ensures that no plane can write to any other plane. The Bounds Engine proposes; the Fact Layer executes. This separation is not a software convention — it is a physical substrate constraint enforced at the Fact Layer. A Machine actor occupying both the Bounds Engine and Fact Layer simultaneously is architecturally impossible under the DAP.

This plane isolation is what makes the Bailout Protocol's fail-safe guarantees structurally non-optional. The trigger fires; the propagation path is defined and enforced; the resolution is recorded in the tamper-evident Forensic Ledger. There is no execution path by which the system bypasses the human and continues autonomous operation.

\subsection{The BX3 Framework's Three-Layer Model}
\label{sec:threelayer}

The BX3 Framework's three-layer model defines the minimum required functional properties — Purpose, Bounds Engine, and Fact Layer — that any autonomous system must satisfy to remain stable, accountable, and deterministic regardless of which actor (Human or Machine) occupies each layer \cite{bansal2019}.

\textbf{Layer 1: Purpose.} The Purpose layer is the accountability anchor. It sets the strategic goals, authorization boundaries, and success criteria for the node's operation. The Purpose layer is architecturally isolated from execution — it does not propose or execute actions. It authorizes. Critically, the Purpose layer must always remain Human-anchored. This is not a policy convention; it is a structural constraint enforced at the Fact Layer. A node whose Purpose layer is not Human-anchored is architecturally invalid under the BX3 Framework.

The Human Accountability Anchor is a specific, unique node in the hierarchy — the root. Every BX3 node carries an immutable \texttt{humanRoot} field sealed at instantiation and propagated to all descendants through the \texttt{parentPurposeHash} mechanism. The derivation is deterministic and acyclic: following parent pointers from any node terminates at a unique Human Accountability Anchor. This immutability is what makes the \texttt{humanRoot} a trustworthy propagation target for the Bailout Protocol's escalation algorithm.

\textbf{Layer 2: Bounds Engine.} The Bounds Engine is the heuristic reasoning layer. It computes, proposes state transitions, and evaluates conditions. It is \emph{limbless} — it has no physical execution permissions. It cannot act on the physical world directly. Its role is to reason about the world and propose actions to the Fact Layer.

The Bounds Engine implements the Z-Axis Indexing mechanism for dimensional context profiling: continuous indexed profiles along operational dimensions detect stratification events before they become failures. When the Bounds Engine's projection sandbox detects that a proposed execution would violate the Safety Envelope, it fires the SEV-P trigger condition — the predictive fail-safe signal that halts the system before the unsafe action is executed.

The Bounds Engine is the layer that implements the trigger conditions for the Bailout Protocol. However — and this is a critical architectural property — the Bounds Engine does \emph{not} resolve trigger conditions. It evaluates conditions and fires triggers. Resolution authority rests exclusively at the Human Accountability Anchor. The Bailout Protocol is triggered \emph{by} the Bounds Engine but operates \emph{above} it.

\textbf{Layer 3: Fact Layer.} The Fact Layer is the physical execution firewall. It receives proposed actions from the Bounds Engine and executes only those commands that satisfy the hard-coded safety, regulatory, and physical constraints defined at the Purpose layer. The Fact Layer is 100\% deterministic. It does not reason — it enforces.

The Fact Layer implements two co-requisite enforcement mechanisms for the Bailout Protocol. First, the append-only Forensic Ledger: a tamper-evident audit trail maintained across all nine planes of the DAP. Every Bailout Protocol state transition and propagation event is recorded as a ledger entry. The ledger's integrity property — any retrospective modification breaks the hash chain and is detectable in O(1) — ensures that the protocol's history is permanently auditable.

Second, the Sandbox Gate: a pre-deployment validation mechanism that models the outcome of a proposed execution before physical actuators unlock. The Sandbox Gate operates at the Fact Layer, not the Bounds Engine, and its output is a binary authorization or rejection. When the Bailout Protocol is in the \texttt{WAITING\_FOR\_RESOLUTION} state, the Sandbox Gate blocks execution of the triggering action pending human resolution. This is not a software permission — it is a physical substrate constraint. No agent in the hierarchy can bypass the Sandbox Gate.

The three-layer model is actor-agnostic: Human and Machine actors can be swapped across the Purpose, Bounds Engine, and Fact layers without loss of deterministic integrity, provided the functional property requirements of each layer are satisfied. This interchangeability is the foundation for scalable human-machine teaming. A human can occupy the Bounds Engine; a machine can occupy the Purpose layer — but the \emph{non-negotiable rule} (the Human Root Mandate) requires that the Purpose layer always remain Human-anchored.

The Bailout Protocol is the runtime expression of the three-layer model's accountability guarantee. The three-layer model declares at design time that every autonomous action must be attributable to a human decision-maker. The Bailout Protocol enforces this guarantee at runtime, on every decision cycle of every node in the system, through mandatory, non-bypassable escalation to the Human Accountability Anchor.