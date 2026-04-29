% ---------------------------------------------------------------
% Section 6 — Limitations and Future Work
% Paper: Bailout Protocol (Pillar 5)
% ---------------------------------------------------------------

\section{Limitations and Future Work}
\label{sec:limitations}

The Bailout Protocol provides strong correctness guarantees — SAFETY, LIVENESS,
and ACCOUNTABILITY — under the assumptions stated in Section~\ref{sec:bailout-guarantees}.
However, a rigorous treatment requires explicit acknowledgment of the conditions
under which those guarantees degrade, the adversarial threat model under which
the protocol's assumptions may fail, and the engineering trade-offs that constrain
its current deployment scope. This section enumerates the principal limitations
and articulates the research programme that follows from them.

% ----------------------------------------------------------------
\subsection{Human Response Latency}
\label{sec:latency}

The LIVENESS guarantee (Theorem~\ref{th:liveness}) covers only the
trigger's propagation to the \texttt{humanRoot}. It does not bound the human's
response time. In deployed systems, the human anchor is typically a natural person
operating in a multi-channel work environment. A trigger arriving at P7 may sit
unacknowledged for minutes or hours, depending on the human's availability,
attention state, and the notification infrastructure supporting the alert.

This latency creates a window of exposure. During the interval between
the trigger's arrival at \texttt{humanReview} and the human's \texttt{resolve()}
call, the node has reached a safe state — no autonomous action can proceed past
the Fact Layer's \texttt{REVIEW} verdict — but the process that triggered the
bail-out has also halted. In domains where continuity of operation is
time-critical (e.g., real-time process control, medical device coordination,
autonomous vehicle navigation), this pause may itself constitute a system
failure of a different character.

The current protocol mitigates this through the TTL mechanism (\texttt{expired}
state, Plane P9), which surfaces non-resolution as a distinct observable event.
However, TTL expiry is a passive response — it records failure without resolving
it. A more proactive approach would adapt the timeout dynamically based on the
severity of the underlying trigger condition, deferring lower-severity bail-outs
further than high-severity ones. We address this as a future work direction
in Section~\ref{sec:future-adaptive-timeout}.

The human response latency limitation also surfaces a broader assumption
embedded in the ACCOUNTABILITY guarantee (Theorem~\ref{th:accountability}):
that the designated \texttt{humanRoot} is both available and authorised to
resolve the trigger at the time of arrival. In pathological cases — the human
has left the organisation, is incapacitated, or has had their credentials revoked
— the trigger may arrive at an anchor who is no longer the correct accountability
holder. The current protocol does not detect this mismatch; it relies on
organisational governance outside the system to ensure that the Purpose Layer's
\texttt{humanRoot} field remains current.

% ----------------------------------------------------------------
\subsection{Adversarial Conditions and Trigger Suppression}
\label{sec:adversarial}

The correctness guarantees in Section~\ref{sec:bailout-guarantees} assume an
honest-but-curious threat model for intermediate nodes: nodes correctly implement
the \texttt{receiveAndPropagate()} protocol, but a passive adversary may observe
the trigger's propagation through the chain. This model excludes two
adversarial conditions that are realistic in high-stakes deployments:

\bigskip
\noindent
\textbf{Trigger suppression.} A compromised intermediate node at Plane P3–P5
could omit the \texttt{append()} call to the Forensic Ledger and decline to forward
the trigger to its parent, effectively silencing the escalation. The LIVENESS
guarantee assumes that each hop forwards the trigger; it does not independently
verify that forwarding occurred. An adversary with code execution access at an
intermediate node could suppress a trigger without detection — provided they
also control the notification infrastructure that would otherwise alert the
human root to the absence of expected heartbeats.

\bigskip
\noindent
\textbf{Human anchor impersonation.} The \texttt{resolve()} operation at Plane P7
requires human authentication via the \texttt{humanRoot}'s \texttt{nodeId}. If an
adversary obtains long-term credentials associated with the \texttt{humanRoot}'s
identity, they can invoke \texttt{resolve()} and record a fraudulent resolution.
The Forensic Ledger records the resolver's identity, but it does not independently
verify that the entity presenting the credential is the legitimate human — only
that the credential is valid at invocation time.

Both conditions represent failure modes that require security controls outside
the Bailout Protocol itself. The protocol is not designed to be self-contained
against a fully compromised execution environment; it is designed to enforce
accountability in an \emph{honest-but-distributed} system. For truly adversarial
environments — where nodes may behave arbitrarily — additional integrity primitives
are required, including authenticated broadcast of trigger events to a
byzantine-fault-tolerant ledger, multi-factor human authentication at P7,
and independent attestation of the propagation chain by witness nodes.

The EU AI Act's requirements for high-risk systems \citep{EUAIAct} impose
mandatory human oversight for certain automated decisions. The adversarial
conditions described above are directly relevant to compliance mapping under
that framework: a system that fails to detect trigger suppression or credential
theft cannot claim to provide the oversight the Act requires. The current protocol
provides the \emph{structure} of compliance; the adversarial hardening described
above would provide the \emph{evidence} of compliance.

% ----------------------------------------------------------------
\subsection{Scalability: Propagation Chain Length and Latency Bounds}
\label{sec:scalability}

The Liveness bound in Theorem~\ref{th:liveness} is $k \cdot T_{\mathrm{hop}}$,
where $k$ is the depth of the propagation chain and $T_{\mathrm{hop}}$ is the
maximum message latency between adjacent nodes. This bound is tight and
asymptotically minimal, but it conceals a deployment-level concern: in large
multi-agent systems with deep delegation hierarchies, $k$ can grow to dozens
or hundreds of hops. Each hop appends a ledger entry and executes a state
transition, both of which carry non-trivial overhead in bandwidth-constrained
or compute-limited environments (IoT sensor networks, edge deployments,
low-connectivity agricultural fields).

Consider a deployment of the Bailout Protocol in a peer-to-peer sensor network
monitoring soil moisture across a large agricultural operation. A trigger
originating at a leaf-node sensor may traverse ten or twenty relay nodes before
reaching the human anchor. The end-to-end latency $k \cdot T_{\mathrm{hop}}$
may exceed the soil-moisture monitoring cycle time, meaning the trigger arrives
after the environmental state it sought to protect has already changed. This is
not a failure of the protocol's guarantees — the trigger still arrives — but
a failure of the protocol's \emph{utility}: arriving after the relevant
decision window has closed.

The scalability limitation is partially addressed by the hierarchical
clustering design pattern, which keeps delegation trees shallow within each
operational domain. A sensor cluster with a local aggregator node can resolve
low-severity bail-outs locally (subject to the Safety guarantee's constraint
that no autonomous \texttt{resolve()} is possible), propagating to the human
anchor only for high-severity triggers. This is analogous to the TTL severity
classification and is a deployment design choice, not a protocol deficiency.
Nonetheless, the protocol provides no automated guidance for cluster sizing or
delegation depth calibration — these must be configured by the system designer
based on domain-specific latency requirements.

% ----------------------------------------------------------------
\subsection{Exploitation Risk: Protocol as a Denial-of-Service Vector}
\label{sec:exploitation}

The Bailout Protocol's mandatory escalation property, while essential to its
SAFETY guarantee, creates an exploitation surface: a malicious actor with the
ability to trigger repeated bail-out events can cause persistent interruption
of agent operations, effectively using the protocol as a denial-of-service (DoS)
mechanism against the human anchor.

Two sub-cases merit analysis:

\bigskip
\noindent
\textbf{Trigger flooding.} An adversary who can influence the inputs to the
Bounds Engine — for example, by injecting adversarial sensor readings,
crafting misleading context data, or exploiting a weakness in the trigger
classification logic — can cause the system to fire repeated
\texttt{accountability\_boundary} triggers. Each trigger halts the originating
node's autonomous operation and escalates to the human anchor, who must
individually review and resolve each one. At sufficient volume, this floods
the human's review queue, making it impossible to distinguish genuine
high-severity bail-outs from manufactured noise.

\bigskip
\noindent
\textbf{TTL expiry flooding.} A related attack exploits the \texttt{expired}
state. If the human anchor is unavailable for an extended period, each
trigger reaches TTL expiry and is recorded as a non-resolution event. A
coordinated campaign of trigger floods could generate thousands of expired
events, creating an audit-log integrity concern: the Forensic Ledger grows
rapidly with non-resolution records, and the signal-to-noise ratio for
post-hoc forensic analysis degrades significantly.

The protocol as currently specified does not include rate-limiting,
trigger-suppression detection, or adaptive TTL calibration based on trigger
volume. These are deployment-level safeguards that the protocol assumes are
provided by the surrounding infrastructure. The absence of such safeguards
within the protocol itself means that a deployment without additional
anti-Dos hardening is vulnerable to the attacks described above. This
limitation is consistent with the protocol's scope as an accountability
mechanism rather than a general security hardening layer — but it must be
acknowledged as a gap in the threat model.

% ----------------------------------------------------------------
\subsection{Future Work}
\label{sec:future}

The limitations described above define a clear research and engineering
agenda. Four directions are identified as primary:

\bigskip
\noindent
\textbf{Formal verification.}\quad
The correctness properties established in Section~\ref{sec:bailout-guarantees}
are currently given as theorem statements with informal proof sketches.
A full formal verification using a mechanised proof assistant (Coq, Isabelle,
or Lean) would establish the guarantees as theorems with machine-checked
proofs, eliminating the residual gap between the informal argument and a
rigorous correctness claim. Of particular interest is the composition of
SAFETY, LIVENESS, and ACCOUNTABILITY under concurrent trigger scenarios —
the current analysis treats each trigger in isolation; formal verification
would enable reasoning about trigger interactions, priority ordering, and
non-interference between concurrent escalations.

\bigskip
\noindent
\textbf{Adaptive timeout calibration.}\quad
Section~\ref{sec:latency} identified the fixed TTL as a blunt instrument for
managing human response latency. An adaptive approach would parameterise
the TTL based on the \texttt{triggerCondition} severity, the current human
anchor workload (as reported by the notification infrastructure), and the
historical resolution latency for similar trigger types. This would reduce
the disruption caused by low-severity bail-outs when the human is under
load, while maintaining aggressive escalation windows for high-severity
conditions. Implementation requires integration with the notification
infrastructure and a feedback mechanism from the human anchor's resolution
history, neither of which is currently specified in the protocol.

\bigskip
\noindent
\textbf{Distributed human anchor pools.}\quad
The current architecture assigns a single \texttt{humanRoot} per subtree.
This creates a single point of failure and a scalability bottleneck for
human review in large-scale deployments. A distributed anchor pool design
would allow multiple designated humans to share the review load for a
given subtree, with the protocol routing each trigger to an available
anchor based on workload, proximity to the originating node's domain, or
policy-specified specialisation (e.g., environmental triggers routed to
a domain-expert human, financial triggers routed to a compliance expert).
The ACCOUNTABILITY guarantee must be preserved in this design: routing
must not allow a trigger to be resolved by a human who was not in the
originally declared \texttt{humanRoot} set for that subtree. The design
must also handle the case where all anchors in a pool are simultaneously
unavailable, falling back to the TTL expiry mechanism.

\bigskip
\noindent
\textbf{Adversarial hardening.}\quad
The trigger suppression and credential theft attacks described in
Section~\ref{sec:adversarial} require hardening measures that are outside
the current protocol's scope: authenticated trigger broadcast to a
byzantine-fault-tolerant log, multi-factor authentication at P7,
cross-node attestation of propagation chain integrity, and rate-limiting
at each node based on trigger history. These mechanisms interact with the
protocol at the edges (trigger generation, human resolution) but do not
alter the core state machine or the propagation semantics. They are therefore
additive rather than modifying — the protocol's guarantees must be shown
to hold under the hardened assumptions, but the core logic remains unchanged.

% ---------------------------------------------------------------
% End of Section 6