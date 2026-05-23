# Planning Through Contact: Why C3 Changes the Game

Most robotic manipulation systems treat contact as something to be avoided — plan a precise trajectory, execute it cleanly, and never let the robot touch anything it wasn't supposed to. This works well for structured industrial tasks, but it breaks down the moment you try to do anything genuinely interesting.

Pushing an object across a table. Pivoting a box. Catching a toss. All of these require the robot to *reason about* contact — to plan not just how to move, but when to touch, where, and with how much force. Traditional planners can't do this because contact is fundamentally non-smooth: the moment two surfaces touch, the dynamics change discontinuously.

## The Standard Workaround

The classic fix is to break the problem into phases. You pre-specify a contact sequence — "lift here, slide there, release" — and then solve a smooth trajectory optimization within each phase. This works when you already know exactly what contacts you need. But knowing the contact sequence in advance is the hard part. For anything involving unexpected geometry, deformable objects, or dynamic environments, pre-specifying contacts is the bottleneck.

Researchers have been working around this for years with increasingly clever heuristics. Sample-based planners try random contact configurations and hope something useful emerges. Learning-based approaches train on massive datasets to internalize contact knowledge implicitly. Both are powerful, but neither gives you a clear model you can reason about, simulate, and debug.

## What Contact-Implicit Planning Does Differently

Contact-implicit trajectory optimization sidesteps the phase-sequencing problem entirely. Instead of fixing the contact mode in advance, it treats contact forces as *decision variables* in the optimization. The planner is free to discover on its own whether and where contact should occur.

The catch is that contact is governed by complementarity constraints: if two surfaces aren't touching, the contact force is zero; if they are touching, the normal force is non-negative. Mathematically, this is written as:

```
φ(q) ≥ 0,   λ ≥ 0,   φ(q) · λ = 0
```

where `φ(q)` is the signed distance between surfaces and `λ` is the contact force. This complementarity condition is non-convex and non-smooth — standard gradient-based solvers struggle with it.

## C3: Consensus Complementarity Control

[C3](https://github.com/DAIRLab/c3) (Consensus Complementarity Control) is a framework developed at the DAIRLab that makes contact-implicit MPC tractable for real-time use. The key idea is to decompose the problem using ADMM (Alternating Direction Method of Multipliers), splitting the non-convex complementarity problem into a sequence of simpler subproblems that can each be solved efficiently.

At each timestep, C3 solves a receding-horizon optimization that simultaneously plans:

- **Smooth dynamics** — how the system evolves between contacts
- **Contact forces** — when and where contact should occur
- **Consensus** — agreement between the two subproblems via a shared variable

This decomposition turns an intractable mixed-integer problem into something that can run fast enough for model predictive control — meaning the robot is continuously re-planning as the world changes around it.

## Why This Matters in Practice

The *Push Anything* paper demonstrated C3 on a particularly hard class of tasks: pushing arbitrary objects across a surface from a single image, with no object-specific training. The robot sees an object it has never encountered, and C3 figures out how to push it to a goal pose by planning through the contact dynamics in real time.

What makes this compelling isn't just the result — it's the *generality*. Because C3 works from first principles rather than learned priors, it doesn't require retraining for new objects, new surfaces, or new tasks. You change the geometry, re-run the planner, and it figures it out.

This is the kind of robustness that matters for real-world deployment. Industrial robots can afford to be brittle because their environments are controlled. Robots operating in the world cannot.

## Where It Goes Next

The honest answer is that contact-implicit MPC is still expensive — C3 gets it into the MPC regime, but not yet at the speed you'd need for high-frequency, high-DOF systems. Scaling to full humanoid manipulation, or to tasks requiring rapid repeated contact like hammering or drumming, is an open problem.

The other frontier is combining C3's contact reasoning with richer perception. Right now the system gets a clean object model from a depth image. Extending it to partial observations, occlusions, and tactile feedback is where a lot of the interesting work is happening.

If you want to dig deeper, the [C3 paper](https://dair.seas.upenn.edu/assets/pdf/Aydinoglu2024.pdf) and [open-source repo](https://github.com/DAIRLab/c3) are the best starting points. The codebase has examples that reproduce the key results and are designed to be easy to extend.
