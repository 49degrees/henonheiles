# Instability Is Not Transport: Geometric Thresholds in the Hénon–Heiles System

**Abstract.** For the Hénon–Heiles Hamiltonian $H=\tfrac12(p_x^2+p_y^2+x^2+y^2)+x^2y-\tfrac13y^3$, the harmonic energy $J$ and the cubic term $V_3=x^2y-y^3/3$ satisfy $J(t)+V_3(\mathbf q(t))=E$ exactly along every trajectory. A criterion that flags a "large" perturbation when $|V_3|\ge\alpha E$ at fixed $\alpha$ places its threshold at the fraction $\alpha/D_{\rm abs}^{\rm geom}(E)$ of the maximum absolute excursion $|V_3|_{\max}$ available in the bounded well. We obtain closed-form turning radii $r_\pm(E)$ from the trigonometric solution of a cubic, prove that $|V_3|_{\max}$ is global over the bounded region, and show that $D_{\rm abs}^{\rm geom}(E)=2r_-/(3-2r_-)$ increases strictly from about $0.32$ at $E=0.05$ to $2$ as $E\to1/6^-$, a factor of about $6.3$. The same fixed $\alpha$ therefore occupies a different part of the admissible range at each energy. The normalization $\alpha(E)=\beta\,D_{\rm abs}^{\rm geom}(E)$ holds the threshold at a fixed fraction $\beta$ of $|V_3|_{\max}$. For context we recompute three classical results: the $S^3$ topology of the bounded energy surface, the quartic Birkhoff–Gustavson normal form (verified symbolically), and a bound on single-lag diffusivity. The note is a pedagogical calibration of one geometric scale and makes no claim about transport.

---

## 1. Introduction

The Hénon–Heiles Hamiltonian [1]
$$H=\tfrac12(p_x^2+p_y^2+x^2+y^2)+x^2y-\tfrac13y^3\equiv H_2+V_3 \tag{1}$$
is a standard model for the onset of chaos in systems with two degrees of freedom [2,3]. For $0<E<1/6$ the energy surface has a bounded component. At $E_c=1/6$ three saddle channels open; above $E_c$ trajectories *can* escape through them, but not every trajectory does.

This note is a pedagogical calibration. It examines the criterion that flags "large" cubic perturbation when $|V_3|\ge\alpha E$ for fixed $\alpha\in(0,1]$. We do not claim that any published study uses this criterion. It is a worked example of a general point: a threshold stated as a fixed fraction of the energy can change its geometric meaning as the energy changes.

The contribution is an exact calibration. We find $|V_3|_{\max}$ over the bounded well in closed form, prove it is a global maximum, show that $D_{\rm abs}^{\rm geom}(E)=|V_3|_{\max}/E$ grows strictly with energy, and give the normalization that holds the threshold at a fixed fraction of the available excursion. Sections 5–7 collect standard results for context.

---

## 2. The exact identity and the fixed-threshold problem

Along any trajectory of (1),
$$J(t)=E-V_3(\mathbf q(t)),\qquad J=\tfrac12(p_x^2+p_y^2+x^2+y^2). \tag{2}$$
This follows from $H=J+V_3=E$ and is an identity, not an approximation.

On the Poincaré section $y=0,\ p_y>0$ [12], $V_3=0$, so $J=E$ at every crossing. In general $|\Delta J|=|V_3(t)-V_3(0)|$, which reduces to $|V_3(t)|$ only for initial points on the section.

In polar coordinates $(r,\varphi)$, $V_3=\tfrac13r^3\sin3\varphi$. Two families of symmetry rays bound the range of $V_3$ at fixed energy:

- **Saddle-approach rays** ($\sin3\varphi=-1$, i.e. $\varphi=\pi/2,\,7\pi/6,\,11\pi/6$). They point toward the three saddles, and $V_3<0$ on them. The inner turning radius is $r_-(E)$.
- **Steep rays** ($\sin3\varphi=+1$). Here $V_3>0$, and the turning radius is $r_+(E)$.

Throughout, *fraction* means a fraction of the maximum absolute excursion $|V_3|_{\max}$ over the bounded well. It does not mean a fraction of configuration-space area or of the peak-to-peak range.

A fixed threshold $|V_3|\ge\alpha E$ sits at the fraction
$$\beta_{\rm eff}(E)=\frac{\alpha E}{|V_3|_{\max}}=\frac{\alpha}{D_{\rm abs}^{\rm geom}(E)}.$$
If $D_{\rm abs}^{\rm geom}$ grows with $E$, the same $\alpha$ sits at a smaller fraction of the available excursion. This concerns only where the threshold lies within the admissible range. It says nothing about crossing probabilities or passage times.

---

## 3. Turning radii and the geometric bound

Write $V=\tfrac12r^2+\tfrac13r^3s$ with $s=\sin3\varphi$. Let $D_E$ be the bounded connected component of $\{V\le E\}$ containing the origin. For $E<1/6$ the escape channels lie in other components. $D_E$ is the configuration-space projection of the bounded energy surface. Since $V_3$ does not depend on momenta, $|V_3|_{\max}$ means the maximum of $|V_3|$ over $D_E$.

**Lemma 1 (global extremum).** *Let $0<E<1/6$. Then $D_E=\{r\le r_b(\varphi)\}$, where $r_b(\varphi)$ is the unique root in $(0,1)$ of $\tfrac12r^2+\tfrac13r^3s=E$. The boundary radius $r_b$ is strictly decreasing in $s$. Moreover $\max_{D_E}|V_3|=r_-^3/3$ and $\max_{D_E}V_3=r_+^3/3$, where $r_\mp=r_b|_{s=\mp1}$.*

*Proof.* Fix $\varphi$ and put $g(r)=\tfrac12r^2+\tfrac13sr^3$.

- *Existence and uniqueness.* $g(0)=0$, and $g'(r)=r(1+sr)>0$ on $(0,1)$ because $|s|\le1$. Also $g(1)=\tfrac12+\tfrac s3\ge\tfrac16>E$. So $g=E$ has exactly one root $r_b\in(0,1)$.
- *Shape.* On $r=1$, $V\ge\tfrac16>E$. Hence the component of $\{V\le E\}$ containing the origin lies inside the unit circle and equals $\{r\le r_b(\varphi)\}$. So $D_E$ is star-shaped and compact.

(i) *The maximum lies on the boundary.* At fixed $\varphi$, $|V_3|=\tfrac13r^3|s|$ is nondecreasing in $r$, so the maximum over $D_E$ is attained at $r=r_b(\varphi)$.

(ii) *Monotonicity.* Implicit differentiation of $g(r_b)=E$ gives
$$\frac{dr_b}{ds}=-\frac{r_b^2}{3(1+sr_b)}<0,$$
since $1+sr_b>0$. Hence $r_-=r_b|_{s=-1}>r_b|_{s=+1}=r_+$.

(iii) *Boundary values.* On $\partial D_E$, $V=E$, so $V_3=E-\tfrac12r_b^2$. By (ii) this is strictly increasing in $s$:

| $s$ | boundary equation | $V_3$ on the boundary |
|---|---|---|
| $-1$ | $\tfrac12r_-^2-\tfrac13r_-^3=E$ | $-r_-^3/3$ |
| $+1$ | $\tfrac12r_+^2+\tfrac13r_+^3=E$ | $+r_+^3/3$ |

Combining (i) with $r_->r_+$ gives the stated maxima. $\square$

**Theorem 1.** *For $0<E<1/6$ let $\theta(E)=\arccos(1-12E)\in(0,\pi)$. Then*
$$r_-(E)=\tfrac12+\cos\!\Big(\tfrac\theta3-\tfrac{2\pi}3\Big),\qquad r_+(E)=-\tfrac12-\cos\!\Big(\tfrac\theta3+\tfrac{2\pi}3\Big), \tag{3}$$
*and*
$$D_{\rm abs}^{\rm geom}(E)\equiv\frac{|V_3|_{\max}}{E}=\frac{r_-^3}{3E}=\frac{2r_-}{3-2r_-}, \tag{4}$$
*which increases strictly on $(0,1/6)$, with limits $0$ as $E\to0^+$ and $2$ as $E\to1/6^-$.*

*Proof.* On a saddle-approach ray, $\tfrac12r^2-\tfrac13r^3=E$ is equivalent to $2r^3-3r^2+6E=0$. Substituting $r=u+\tfrac12$ gives the depressed cubic
$$u^3-\tfrac34u+\big(3E-\tfrac14\big)=0. \tag{5}$$
With $p=-\tfrac34$ and $q=3E-\tfrac14$, the discriminant is
$$\Delta=-4p^3-27q^2=243E\big(\tfrac16-E\big)>0\quad(0<E<\tfrac16),$$
so the cubic has three distinct real roots. Setting $u=\cos\psi$ turns (5) into $\cos3\psi=1-12E$, giving roots $r_k=\tfrac12+\cos\!\big(\tfrac{\theta+2\pi k}{3}\big)$, $k=0,1,2$.

For $\theta\in(0,\pi)$ the angle ranges fix each branch directly:

| $k$ | angle range | $r_k$ range | identification |
|---|---|---|---|
| 0 | $(0,\pi/3)$ | $(1,\tfrac32)$ | exterior root, beyond the saddle |
| 1 | $(2\pi/3,\pi)$ | $(-\tfrac12,0)$ | negative, unphysical |
| 2 | $(-2\pi/3,-\pi/3)$ | $(0,1)$ | inner turning point $r_-$ |

So $r_-=r_2$ for every $E$ in the interval.

On the steep ray the equation $2r^3+3r^2-6E=0$ is the saddle equation with $r\to-r$. Its unique positive root is $r_+=-r_1\in(0,\tfrac12)$, which gives the second formula in (3). Uniqueness holds because the left side is increasing for $r>0$.

From $E=r_-^2(3-2r_-)/6$ we get $r_-^3/(3E)=2r_-/(3-2r_-)$, which is (4). Since $\dfrac{d}{dr_-}\dfrac{2r_-}{3-2r_-}=\dfrac{6}{(3-2r_-)^2}>0$ and $\dfrac{dE}{dr_-}=r_-(1-r_-)>0$ on $(0,1)$, the chain rule gives strict monotonicity in $E$. The limits follow from $r_-\to0$ as $E\to0^+$ and $r_-\to1$ as $E\to1/6^-$. $\square$

**Exact check at $E=1/12$.** Here $\theta=\pi/2$, so $r_-=\tfrac12$ and $D_{\rm abs}^{\rm geom}=\tfrac12$. Also $r_+=(\sqrt3-1)/2$, giving the **positive steep-ray value**
$$(V_3/E)_{\rm steep}=\frac{r_+^3}{3E}=3\sqrt3-5\approx0.1962.$$
This is the steep-ray value, not the maximum absolute value. The script checks it to $10^{-12}$.

**Small-energy behaviour.** As $E\to0$,
$$D_{\rm abs}^{\rm geom}(E)=\frac{2\sqrt2}{3}\sqrt E\,\big[1+\sqrt{2E}+O(E)\big]. \tag{4a}$$
The growth reflects $|V_3|\sim r^3\sim E^{3/2}$ on the energy surface, divided by $E$. The leading term alone is within 5% of $D_{\rm abs}^{\rm geom}$ only for $E\lesssim10^{-3}$. At $E=10^{-2}$ it is about 15% low, and at $E=0.05$ it gives $0.21$ against $0.32$. The script checks (4a) for $10^{-5}\le E\le10^{-2}$.

**Table 1.** Turning radii and geometric bounds, from the output of `verify_tables()` in Appendix A. Here $(V_3/E)_{\rm steep}=r_+^3/(3E)$ and $D_{\rm range}^{\rm geom}=(r_-^3+r_+^3)/(3E)$. The last row is the one-sided limit $E\to1/6^-$; $E=1/6$ lies outside the domain of Lemma 1 and Theorem 1.

| $E$ | $r_-$ | $r_+$ | $D_{\rm abs}^{\rm geom}$ | $(V_3/E)_{\rm steep}$ | $D_{\rm range}^{\rm geom}$ |
|---|---|---|---|---|---|
| 0.050 | 0.3633 | 0.2895 | 0.3196 | 0.1618 | 0.4813 |
| 1/12 | 0.5000 | 0.3660 | 0.5000 | 0.1962 | 0.6962 |
| 0.100 | 0.5671 | 0.3976 | 0.6078 | 0.2095 | 0.8174 |
| 1/8 | 0.6736 | 0.4397 | 0.8152 | 0.2267 | 1.0419 |
| 0.150 | 0.8042 | 0.4771 | 1.1558 | 0.2413 | 1.3971 |
| 0.165 | 0.9411 | 0.4978 | 1.6838 | 0.2492 | 1.9330 |
| $1/6^-$ (limit) | 1.0000 | 0.5000 | 2.0000 | 0.2500 | 2.2500 |

***[INSERT FIGURE 1 HERE: Generated by `plot_figure1()` in Appendix A. Ensure `figure1.pdf` is uploaded as a separate file during submission.]***

**Figure 1.** **(a)** The blue curve is $D_{\rm abs}^{\rm geom}(E)=2r_-/(3-2r_-)$. It grows strictly from about $0.32$ at $E=0.05$ to the limit $2$ as $E\to1/6^-$, a ratio of $6.26$. The fixed criterion $\alpha=1$ (red dashed) sits at the fraction $1/D_{\rm abs}^{\rm geom}(E)$ of $|V_3|_{\max}$. The curves cross at $E=9/64$ (dotted), the energy at which $\max_{D_E}|V_3|=E$. Below this energy the condition $|V_3|\ge E$ cannot be met anywhere in the bounded well. **(b)** The fixed threshold $\alpha=1$ compared with the adaptive threshold $\alpha(E)=0.5\,D_{\rm abs}^{\rm geom}(E)$ of Eq. (7).

---

## 4. Energy-dependent threshold normalization

The normalized threshold is
$$\alpha(E)=\beta\,D_{\rm abs}^{\rm geom}(E),\qquad\beta\in(0,1]. \tag{7}$$
The criterion $|V_3|\ge\alpha(E)E$ then flags exactly the states whose $|V_3|$ exceeds the fraction $\beta$ of $|V_3|_{\max}$, at every energy.

- At $E=0.05$, $\alpha\approx0.32\beta$. As $E\to1/6^-$, $\alpha\to2\beta$.
- $\alpha(E)$ can exceed $1$ when $\beta>1/2$ and $E$ is near escape. This is consistent, since $|V_3|/E$ can exceed $1$ once $E>9/64$. For $\beta\le1/2$, $\alpha(E)\le1$ throughout.

**Attainability of a fixed $\alpha$.** A fixed $\alpha$ can fire only where $\beta_{\rm eff}=\alpha/D_{\rm abs}^{\rm geom}(E)\le1$. Solving $2r/(3-2r)=\alpha$ gives $r_\alpha=3\alpha/(2(1+\alpha))$ and the onset energy
$$E_\alpha=\tfrac16\,r_\alpha^2(3-2r_\alpha). \tag{7a}$$
From the run:

| $\alpha$ | $E_\alpha$ |
|---|---|
| 1/4 | 0.036 |
| 1/2 | 1/12 |
| 1 | $9/64\approx0.141$ |

Below $E_\alpha$ the threshold lies above $|V_3|_{\max}$, so $\beta_{\rm eff}>1$ and the criterion is unattainable there. Figure 1 uses $\alpha=1$ because it is the strictest value in $(0,1]$ and has the latest onset. At $E=0.05$, $\beta_{\rm eff}\approx3.1$, so the criterion cannot fire. As $E\to1/6^-$, $\beta_{\rm eff}\to0.5$.

**Libration alone can fire a small-$\alpha$ criterion.** For $\alpha=0.1$, the criterion is attainable from $E_{0.1}\approx0.0085$, and for $\alpha=0.05$ from $E_{0.05}\approx0.0024$ (both from (7a)). At $E=0.05$, $|V_3|_{\max}\approx0.0160$, which is $3.2$ times the $10\%$ threshold $0.005$. A trajectory can therefore cross it by libration alone. A first-passage time to $|\Delta J|\ge0.1E$ at that energy measures libration, not drift.

---

## 5. Topology of the bounded energy surface (context)

For $0<E<1/6$, the bounded energy surface $\Sigma_E^{\rm well}$ is diffeomorphic to $S^3$, and the bounded sublevel set $M_E^{\rm well}=\{H\le E\}\cap(\mathbf q\in D_E)$ is diffeomorphic to $B^4$.

*Proof sketch.* The critical points of $H$ have $\mathbf p=0$ and $\nabla V=0$: the origin ($H=0$) and the three saddles $(0,1)$, $(\pm\sqrt3/2,-1/2)$ ($H=1/6$). So every $E\in(0,1/6)$ is a regular value on the well. $M_E^{\rm well}$ is compact, since $\mathbf q\in D_E$ (compact by Lemma 1) and $|\mathbf p|^2\le2(E-V)$. Its only critical point is the origin, a nondegenerate minimum of index $0$. Morse theory [4, §3] then gives $M_E^{\rm well}\cong B^4$ and $\Sigma_E^{\rm well}=\partial M_E^{\rm well}\cong S^3$. $\square$

The momentum fibres over $D_E$ are circles that collapse to points on $\partial D_E$, which is the picture of $S^3\subset\mathbb C^2$ projected onto a disk. This is not the Hopf fibration. By Alexander duality [5, §3.3], any smoothly embedded torus in $\Sigma_E^{\rm well}$ separates it into two components. No claim is made that such a torus exists at a given energy.

---

## 6. Quartic normal form (context)

We recompute the classical quartic normal form of Gustavson [11] by the Lie-transform method of Deprit and Hori [6,7]. It is not claimed as new.

**Notation.** With $a_j=(q_j+ip_j)/\sqrt2$ and normal-form coordinates $\bar a_j$, the normal-form actions are
$$\bar J=|\bar a_1|^2+|\bar a_2|^2,\qquad \bar L=i(\bar a_1\bar a_2^*-\bar a_1^*\bar a_2).$$
Both are conserved by the truncated normal-form flow. They differ from the instantaneous physical quantities $J_{\rm phys}=\tfrac12(p_x^2+p_y^2+x^2+y^2)$ and $L_{\rm phys}=xp_y-yp_x$, which the full flow does not conserve. The Stokes variables
$$S_1=|a_1|^2-|a_2|^2,\qquad S_2=a_1a_2^*+a_1^*a_2,\qquad S_3=i(a_1a_2^*-a_1^*a_2)$$
satisfy $\{S_i,S_j\}=2\epsilon_{ijk}S_k$, asserted in the script.

**Convention.** $\{f,g\}=\sum_j(\partial_{q_j}f\,\partial_{p_j}g-\partial_{p_j}f\,\partial_{q_j}g)$ and $\bar H=e^{\mathrm{ad}_\chi}H$ with $\chi=\chi_3+\chi_4+\cdots$, $\mathrm{ad}_\chi f=\{\chi,f\}$.

- *Cubic order.* $\{H_2,\chi_3\}=H_3$ is solvable because no cubic monomial is resonant.
- *Quartic order.* With $H_4=0$ originally, the quartic term is $\tfrac12\{\chi_3,H_3\}+\{\chi_4,H_2\}$. The last term is non-resonant, so
$$\bar H_4^{\rm res}=\mathcal P_{\rm res}\big[\tfrac12\{\chi_3,H_3\}\big].$$

The opposite sign convention, $\chi\to-\chi$, gives the same $\bar H_4$.

**Result.**
$$\bar H=\bar J-\tfrac5{12}\bar J^2+\tfrac7{12}\bar L^2+O(\bar J^3). \tag{8}$$
The script checks this with exact rational arithmetic: the cubic homological equation has zero residual; the Lie series removes the cubic term and gives $\tfrac12\{\chi_3,H_3\}$ at quartic order; and all nine resonant quartic monomials have the coefficients of (8). In real-mode coordinates (8) contains the cross-resonant terms $-\tfrac7{12}(a_1^2a_2^{*2}+a_1^{*2}a_2^2)$, because $L\ne|a_1|^2-|a_2|^2$.

**Lindstedt check.** The $y$-axis ($x=0$) is invariant with $L=0$, and on it $\ddot y+y-y^2=0$. The $x$-axis is not invariant. Equation (8) predicts $\omega=1-\tfrac56E+O(E^2)$, consistent with the Lindstedt result [8]. This is a direct $L=0$ check; it does not test the $7/12$ coefficient.

**Near-circular initial conditions check.** For initial conditions that are circular in the harmonic limit ($|\bar L|\approx\bar J$), (8) predicts a mean rotation frequency $1+E/3+O(E^2)$. Numerical integration at $E=0.005,0.01,0.02,0.04$ gives $[\omega-(1+E/3)]/E^2$ of $-1.22,-1.01,-1.20,-1.16$. This exploratory check is consistent with an $O(E^2)$ remainder and the correct sign of the $7/12$ term, supporting (8) beyond the $L=0$ check. Note that these are near-circular initial conditions for the full system, not exact circular orbits.

**Secular period.** In the normal form,
$$\frac{d(\theta_+-\theta_-)}{dt}=\frac{7\bar L}{3}+O(\bar J^2),$$
so the Stokes variables have period
$$\tau_{\rm sec}=\frac{6\pi}{7|\bar L|}\big[1+O(E)\big], \tag{12}$$
an expansion about $E=0$ with $|\bar L|/\bar J$ bounded away from zero. The angle conjugate to $\bar L$ is $(\theta_+-\theta_-)/2$, which rotates at half that rate, with period $12\pi/(7|\bar L|)$.

**Error bookkeeping.**
- (a) $\bar J=E+O(E^2)$. Replacing $\bar J$ by $E$ costs a relative $O(E)$.
- (b) $L_{\rm phys}=\bar L+O(E^{3/2})$. Using $L_{\rm phys}$ in place of $\bar L$ makes the relative error $O(\sqrt E)$ when $|\bar L|\gtrsim E$.

Equation (12) is a small-$E$ asymptotic result. Its remainder is not controlled near $E_c$, so near escape $\tau_{\rm sec}$ is only a formal reference scale.

---

## 7. Single-lag diffusivity bound (context)

For an observable with $|A|\le A_{\max}$, the single-lag estimator $\hat D=(A(T)-A(0))^2/(2T)$ satisfies
$$\hat D\le\frac{2A_{\max}^2}{T}.$$
So a single-lag estimator cannot establish a nonzero asymptotic diffusion coefficient for a bounded observable, whatever the dynamics. The bound does not rule out first-passage measurements between pre-defined phase-space regions [9,10].

---

## 8. An illustrative passage protocol (not executed)

1. **Partition.** On the section disk $x^2+p_x^2\le2E$, fix an inner region $\mathcal R_1=\{x^2+p_x^2<\gamma E\}$ and the outer annulus $\mathcal R_2$, for a fixed $\gamma\in(0,2)$. This defines a valid regional passage event. The dividing circle is not claimed to be a partial barrier. Passage across it must not be read as cantorus transport [9,10] unless $\gamma$ is justified, for example by scanning $\gamma$ or relating the boundary to computed invariant curves.
2. **Censored passage.** For a stated ensemble, record the first passage from $\mathcal R_k$ to $\mathcal R_{k'}$ under the return map up to a horizon $T_{\max}$. Trajectories not crossing by $T_{\max}$ are right-censored.
3. **Censoring-aware summaries.** Report the Kaplan–Meier survival curve [13], the restricted mean over $[0,T_{\max}]$, or the median if the curve reaches $1/2$. Do not report an unrestricted mean.

This is a proposal. No relationship between chaos and transport is claimed.

---

## 9. Discussion

The identity $J=E-V_3$ makes Hénon–Heiles an unusually clean setting for studying action excursions. The calibration has three parts: the exact bound $D_{\rm abs}^{\rm geom}(E)=2r_-/(3-2r_-)$, its global validity over the bounded well (Lemma 1), and its strict growth by a factor of about $6.3$ over $0.05\le E<1/6$. Together they show that a fixed threshold $|V_3|\ge\alpha E$ is not the same test at different energies. The normalization (7) corrects this single geometric scale.

Three limitations remain. The normalization does not make crossing statistics dynamically invariant. It does not account for invariant structures that may keep a trajectory from reaching the global maximum. And it says nothing about transport. Sections 5–7 are standard context.

---

## Appendix A: Verification code and logged output

The script and output below come from a single run. Every check is an `assert`, so the script stops on any mismatch. An identical copy is supplied as `appendix_a.py`.

```python
"""
Verification code for "Geometric Calibration of Fixed-Fraction Action
Thresholds in the Henon-Heiles System."  Run: python appendix_a.py
All checks use assert: the script fails loudly if anything mismatches.
"""
import sys
import sympy as sp
import numpy as np
import scipy
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def print_env():
    print(f"python {sys.version.split()[0]}, sympy {sp.__version__}, "
          f"numpy {np.__version__}, scipy {scipy.__version__}, "
          f"matplotlib {matplotlib.__version__}\n")


def radii(E):
    th = np.arccos(np.clip(1 - 12*E, -1, 1))
    rm = 0.5 + np.cos(th/3 - 2*np.pi/3)
    rp = -0.5 - np.cos(th/3 + 2*np.pi/3)
    return rm, rp


# -- Lemma 1: global extremum of V3 over the bounded Hill region ------
def verify_global_max():
    """
    Lemma 1: on the bounded Hill region {V <= E}, V = r^2/2 + r^3 sin(3 phi)/3,
    max|V3| = r_-^3/3 and max V3 = r_+^3/3.  Checked three ways:
    (a) boundary radius r_b(phi) from a root solve; V3 on the boundary,
    (b) r_b is strictly decreasing in s = sin(3 phi),
    (c) brute-force polar grid over the whole region (interior included).
    """
    from scipy.optimize import brentq
    for E in (0.02, 0.05, 1/12, 0.10, 0.15, 0.165):
        rm, rp = radii(E)
        phi = np.linspace(0, 2*np.pi, 4001)
        s = np.sin(3*phi)
        rb = np.array([brentq(lambda r, si=si: r**2/2 + si*r**3/3 - E,
                              1e-12, 1.0, xtol=1e-14) for si in s])
        assert np.all(rb < 1.0)
        V3b = rb**3 * s / 3
        assert np.max(np.abs(V3b - (E - rb**2/2))) < 1e-12
        order = np.argsort(s)
        s_o, rb_o = s[order], rb[order]
        keep = np.concatenate(([True], np.diff(s_o) > 1e-12))
        assert np.all(np.diff(rb_o[keep]) < 0), "r_b not decreasing in s"
        mx, mn = V3b.max(), V3b.min()
        assert abs(mn + rm**3/3) < 1e-9, f"min V3 != -r_-^3/3 at E={E}"
        assert abs(mx - rp**3/3) < 1e-9, f"max V3 != r_+^3/3 at E={E}"
        R, P = np.meshgrid(np.linspace(0, 1, 1500),
                           np.linspace(0, 2*np.pi, 1500))
        V3g = R**3 * np.sin(3*P) / 3
        inside = R**2/2 + V3g <= E
        rb_g = np.interp(P[:, 0], phi, rb)[:, None]
        mask = inside & (R <= rb_g + 1e-12)
        dr = 1.0/1499
        gmax_abs, gmax_pos = np.max(np.abs(V3g[mask])), np.max(V3g[mask])
        assert gmax_abs <= rm**3/3 + 1e-9
        assert gmax_pos <= rp**3/3 + 1e-9
        assert gmax_abs >= rm**3/3 - 2*rm**2*dr, "grid max too far below r_-^3/3"
        assert gmax_pos >= rp**3/3 - 2*rp**2*dr, "grid max too far below r_+^3/3"
        print(f"E={E:.4f}: max|V3|={gmax_abs:.6f} "
              f"(grid) vs r_-^3/3={rm**3/3:.6f};  max V3={gmax_pos:.6f}"
              f" vs r_+^3/3={rp**3/3:.6f}")
    print("Lemma 1 checks passed (boundary, monotonicity, brute force).")


# -- Attainability of a fixed alpha -----------------------------------
def verify_alpha_thresholds():
    """
    Geometric attainability of a fixed threshold alpha: |V3| can reach
    alpha E somewhere in the bounded well iff D_abs(E) >= alpha.
    D_abs = alpha at r_alpha = 3 alpha / (2 (1 + alpha)),
    E_alpha = r_alpha^2 (3 - 2 r_alpha)/6.
    """
    print("\nAttainability of fixed alpha (geometrically attainable iff E >= E_alpha):")
    for al in (0.05, 0.10, 0.25, 0.5, 0.75, 1.0):
        ra = 3*al / (2*(1 + al))
        Ea = ra**2 * (3 - 2*ra) / 6
        rm = radii(Ea)[0]
        assert abs(rm**3/(3*Ea) - al) < 1e-9, "D_abs(E_alpha) != alpha"
        print(f"  alpha={al:4.2f}: r_alpha={ra:.4f}, E_alpha={Ea:.6f}")
    assert abs((3/4)**2*(3 - 1.5)/6 - 9/64) < 1e-15


# -- Table 1 ----------------------------------------------------------
def verify_tables():
    """Print Table 1 (plain and LaTeX rows); verify roots and E = 1/12."""
    rows = [("0.050", 0.050), ("1/12", 1/12), ("0.100", 0.100),
            ("1/8", 1/8), ("0.150", 0.150), ("0.165", 0.165),
            ("1/6-", 1/6)]   # one-sided limit, labelled as such
    hdr = (f"{'E':>6} {'r_-':>8} {'r_+':>8} {'D_abs':>8} "
           f"{'(V3/E)_steep':>13} {'D_range':>8}")
    print(hdr)
    print("-" * len(hdr))
    latex = []
    for lab, E in rows:
        E_eval = E - 1e-12 if lab.endswith('-') else E   # limit from below
        rm, rp = radii(E_eval)
        assert abs(2*rm**3 - 3*rm**2 + 6*E_eval) < 1e-9, f"r_- fails at E={E}"
        assert abs(2*rp**3 + 3*rp**2 - 6*E_eval) < 1e-9, f"r_+ fails at E={E}"
        Da = rm**3 / (3*E_eval)
        assert abs(Da - 2*rm/(3 - 2*rm)) < 1e-9, "identity (4) fails"
        vp = rp**3 / (3*E_eval)
        Dr = (rm**3 + rp**3) / (3*E_eval)
        print(f"{lab:>6} {rm:8.4f} {rp:8.4f} {Da:8.4f} "
              f"{vp:13.4f} {Dr:8.4f}")
        latex.append(f"{lab} & {rm:.4f} & {rp:.4f} & {Da:.4f} & "
                     f"{vp:.4f} & {Dr:.4f} \\\\")
    print("\nLaTeX rows:")
    print("\n".join(latex))

    rp_ex = (np.sqrt(3) - 1) / 2
    val = rp_ex**3 / (3/12)
    exact = 3*np.sqrt(3) - 5
    print(f"\nE=1/12 exact: r_+=(sqrt3-1)/2, r_+^3/(3E)=3sqrt3-5="
          f"{exact:.10f}, numerical={val:.10f}")
    assert abs(val - exact) < 1e-12, "E=1/12 exact check failed"

    Ev = np.linspace(1e-4, 1/6 - 1e-9, 20000)
    Dv = radii(Ev)[0]**3 / (3*Ev)
    assert np.all(np.diff(Dv) > 0), "D_abs not monotone"
    print(f"D_abs(0.05)={radii(0.05)[0]**3/0.15:.4f}, ratio D(1/6)/D(0.05)="
          f"{2/(radii(0.05)[0]**3/0.15):.3f}")
    E1 = (3/4)**2 * (3 - 1.5)/6
    print(f"D_abs=1 at E=9/64={9/64:.6f} (computed {E1:.6f})")

    print("\nSmall-E asymptotics, D_abs vs (2*sqrt(2)/3)*sqrt(E)*(1 + sqrt(2E)):")
    for E in (1e-5, 1e-4, 1e-3, 1e-2):
        D = radii(E)[0]**3 / (3*E)
        lead = 2*np.sqrt(2)/3*np.sqrt(E)
        rho = np.sqrt(2*E)
        assert abs(D/lead - 1) < 1.5*rho, "leading asymptotics fail"
        assert abs(D/lead - (1 + rho)) < 2*rho**2, "next-order asymptotics fail"
        print(f"  E={E:.0e}: D/lead = {D/lead:.5f},  1+sqrt(2E) = {1+rho:.5f}")
    assert abs(radii(1e-3)[0]**3/(3e-3)/(2*np.sqrt(2)/3*np.sqrt(1e-3)) - 1) < 0.05
    assert abs(radii(1e-2)[0]**3/(3e-2)/(2*np.sqrt(2)/3*np.sqrt(1e-2)) - 1) > 0.05
    lead05 = 2*np.sqrt(2)/3*np.sqrt(0.05)
    print(f"  (at E=0.05 the leading term alone gives {lead05:.4f} vs D_abs = "
          f"{radii(0.05)[0]**3/0.15:.4f}: it is a small-E check only)")


# -- Energy conservation check (NOT an algebraic proof) ---------------
def verify_energy_conservation():
    """
    Check that J + V3 = E is maintained under finite-precision integration.
    This is an energy-conservation check for the numerical integrator,
    not an independent proof of the algebraic identity (which is exact by construction).
    """
    from scipy.integrate import solve_ivp
    E = 0.10
    x0, y0 = np.sqrt(2*E)*0.5, 0.0
    px0, py0 = 0.0, np.sqrt(max(2*E - x0**2, 0))

    def rhs(t, z):
        x, y, px, py = z
        return [px, py, -x - 2*x*y, -y - x**2 + y**2]

    sol = solve_ivp(rhs, [0, 20], [x0, y0, px0, py0],
                    max_step=0.01, rtol=1e-10, atol=1e-12)
    x, y, px, py = sol.y
    J = 0.5*(px**2 + py**2 + x**2 + y**2)
    V3 = x**2*y - y**3/3
    res = float(np.max(np.abs(J + V3 - E)))
    print(f"\nEnergy conservation check: max|J+V3-E| = {res:.2e}")
    assert res < 1e-8, "Energy conservation check failed"


# -- Normal form ------------------------------------------------------
def verify_normal_form():
    a1, a1s, a2, a2s = sp.symbols('a1 a1s a2 a2s')
    x  = (a1 + a1s) / sp.sqrt(2)
    px = (a1 - a1s) / (sp.I * sp.sqrt(2))
    y  = (a2 + a2s) / sp.sqrt(2)
    py = (a2 - a2s) / (sp.I * sp.sqrt(2))

    H2 = a1*a1s + a2*a2s
    H3 = sp.expand(x**2 * y - y**3 / 3)
    J = a1*a1s + a2*a2s
    L_poly = sp.I * (a1*a2s - a1s*a2)
    assert sp.simplify(sp.expand(L_poly - (x*py - y*px))) == 0, \
        "L_poly != x p_y - y p_x"

    def pb(f, g):
        return -sp.I * sum(
            sp.diff(f, v)*sp.diff(g, vs) - sp.diff(f, vs)*sp.diff(g, v)
            for v, vs in [(a1, a1s), (a2, a2s)])

    assert sp.simplify(pb(x, px) - 1) == 0 and sp.simplify(pb(y, py) - 1) == 0
    assert sp.simplify(pb(x, py)) == 0

    H3_poly = sp.Poly(H3, a1, a2, a1s, a2s)
    chi3 = sp.Integer(0)
    for mon, c in H3_poly.terms():
        j, k, l, m = mon
        assert j + k != l + m, "resonant cubic term present"
        mono = a1**j * a2**k * a1s**l * a2s**m
        eig = sp.simplify(pb(H2, mono) / mono)
        chi3 += c / eig * mono
    chi3 = sp.expand(chi3)

    he_res = sp.simplify(pb(H2, chi3) - H3)
    print(f"\nHomological eq. {{H2,chi3}}=H3 residual: {he_res}")
    assert he_res == 0, "Homological equation failed"

    H4 = sp.expand(sp.Rational(1, 2) * pb(chi3, H3))

    c_H2 = pb(chi3, H2)
    assert sp.expand(c_H2 + H3) == 0, "{chi3,H2} != -H3"
    assert sp.expand(H3 + c_H2) == 0, "cubic terms not removed"
    deg4 = sp.expand(pb(chi3, H3) + sp.Rational(1, 2)*pb(chi3, c_H2))
    assert sp.expand(deg4 - H4) == 0, "Lie series quartic != (1/2){chi3,H3}"
    print("Lie series exp(ad_chi): cubic terms vanish; quartic = (1/2){chi3,H3}: True")

    H4_poly = sp.Poly(H4, a1, a2, a1s, a2s)
    H4_res = sp.Integer(0)
    for mon, c in H4_poly.terms():
        j, k, l, m = mon
        if j + k == l + m:
            H4_res += c * a1**j * a2**k * a1s**l * a2s**m
    H4_res = sp.expand(H4_res)

    target = sp.expand(-sp.Rational(5, 12)*J**2 + sp.Rational(7, 12)*L_poly**2)
    tp = sp.Poly(target, a1, a2, a1s, a2s)
    hp = sp.Poly(H4_res, a1, a2, a1s, a2s)

    print("\nResonant quartic coefficients, j+k = l+m = 2 "
          "(exponents of a1, a2, a1*, a2*):")
    checked, all_ok = 0, True
    for j in range(3):
        k = 2 - j
        for l in range(3):
            m = 2 - l
            mono = a1**j * a2**k * a1s**l * a2s**m
            cH, cT = hp.coeff_monomial(mono), tp.coeff_monomial(mono)
            ok = sp.simplify(cH - cT) == 0
            all_ok &= bool(ok)
            checked += 1
            print(f"  a1^{j} a2^{k} a1*^{l} a2*^{m}: "
                  f"H4={cH!s:>6}  target={cT!s:>6}  {'OK' if ok else 'FAIL'}")
    assert checked == 9, "did not check nine monomials"
    assert sp.expand(H4_res - target) == 0, "H4_res != target"
    assert all_ok, "coefficient mismatch"
    print(f"All {checked} match; H4_res - target = 0 exactly")

    S1 = a1*a1s - a2*a2s
    S2 = a1*a2s + a1s*a2
    S3 = L_poly
    b12 = sp.expand(pb(S1, S2)); b23 = sp.expand(pb(S2, S3))
    b31 = sp.expand(pb(S3, S1))
    print("\nStokes brackets: {S1,S2}=", b12, " {S2,S3}=", b23,
          " {S3,S1}=", b31)
    assert sp.expand(b12 - 2*S3) == 0, "{S1,S2} != +2 S3"
    assert sp.expand(b23 - 2*S1) == 0, "{S2,S3} != +2 S1"
    assert sp.expand(b31 - 2*S2) == 0, "{S3,S1} != +2 S2"
    print("  {S1,S2} = +2 S3, {S2,S3} = +2 S1, {S3,S1} = +2 S2: all asserted")


# -- L = 0 orbit and Lindstedt check ----------------------------------
def verify_lindstedt():
    """Sanity check at four energies: which axis is invariant, and is the
    y-axis orbit frequency close to 1 - 5E/6 with a remainder of order E^2?
    Four energies are a consistency check, not a proof of the rate; the
    analytical Lindstedt argument is what establishes it."""
    from scipy.integrate import solve_ivp
    print("\nAt y=0: y'' = -x^2 (nonzero) -> x-axis is NOT invariant.")
    def rhs(t, z):
        y, py = z
        return [py, -y + y**2]
    ev = lambda t, z: z[1]
    ev.direction = -1
    for E in (0.005, 0.01, 0.02, 0.04):
        sol = solve_ivp(rhs, [0, 60], [0.0, np.sqrt(2*E)], events=ev,
                        rtol=1e-12, atol=1e-14)
        te = sol.t_events[0]
        T = te[1] - te[0]
        omega = 2*np.pi / T
        pred = 1 - 5*E/6
        print(f"y-axis orbit, E={E:<5}: omega={omega:.6f}, 1-5E/6={pred:.6f}, "
              f"diff={omega-pred:.2e}, diff/E^2={(omega-pred)/E**2:.2f}")
        assert abs(omega - pred) < 5*E**2, "Lindstedt sanity check failed"


# -- Near-circular initial conditions check ---------------------------
def verify_near_circular():
    """
    Exploratory check: mean |dphi/dt| of near-circular initial conditions
    vs 1 + E/3. These initial conditions are circular for the harmonic
    oscillator, not assumed to be exact circular orbits of the full system.
    """
    from scipy.integrate import solve_ivp
    def rhs(t, z):
        x, y, px, py = z
        return [px, py, -x - 2*x*y, -y - x*x + y*y]
    print("\nNear-circular initial conditions: mean |dphi/dt| vs 1 + E/3")
    for E in (0.005, 0.01, 0.02, 0.04):
        rho = np.sqrt(E); T = 4000.0
        sol = solve_ivp(rhs, [0, T], [rho, 0, 0, rho], rtol=1e-12, atol=1e-14,
                        t_eval=np.linspace(0, T, 400001))
        ph = np.unwrap(np.arctan2(sol.y[1], sol.y[0]))
        om = abs((ph[-1] - ph[0]) / T); pred = 1 + E/3
        print(f"E={E}: omega={om:.7f}, 1+E/3={pred:.7f}, "
              f"diff/E^2={(om-pred)/E**2:+.2f}")
        assert abs(om - pred) < 3*E**2


# -- Figure 1 ---------------------------------------------------------
def plot_figure1():
    Ev = np.linspace(0.01, 1/6 - 1e-6, 500)
    th = np.arccos(1 - 12*Ev)
    rm = 0.5 + np.cos(th/3 - 2*np.pi/3)
    Da = 2*rm / (3 - 2*rm)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
    E1 = 9/64
    ax1.plot(Ev, Da, 'b-', lw=2, label=r'$D_{\rm abs}^{\rm geom}(E)$')
    ax1.axhline(1, color='r', ls='--', label=r'fixed $\alpha=1$')
    ax1.axvline(E1, color='gray', ls=':', label=r'$E=9/64$ ($D_{\rm abs}^{\rm geom}=1$)')
    ax1.set_xlabel('$E$'); ax1.set_ylabel(r'$D_{\rm abs}^{\rm geom}$')
    ax1.set_title('(a) Geometric diagnostic')
    ax1.legend(loc='upper left', fontsize=8); ax1.grid(alpha=.3)

    beta = 0.5
    ax2.plot(Ev, np.ones_like(Ev), 'r--', label=r'fixed $\alpha=1$')
    ax2.plot(Ev, beta*Da, 'b-', label=rf'adaptive $\alpha(E)={beta}\,D_{{\rm abs}}^{{\rm geom}}(E)$')
    ax2.axvline(E1, color='gray', ls=':', label=r'$E=9/64$')
    ax2.set_xlabel('$E$'); ax2.set_ylabel(r'threshold $\alpha(E)$')
    ax2.set_title('(b) Threshold comparison')
    ax2.legend(loc='lower right', fontsize=8); ax2.grid(alpha=.3)
    plt.tight_layout()
    for ext in ('pdf', 'png'):
        plt.savefig(f'figure1.{ext}', dpi=150, bbox_inches='tight')
    print("\nFigure 1 saved to figure1.{pdf,png}")
    plt.close()


if __name__ == '__main__':
    print_env()
    verify_tables()
    verify_global_max()
    verify_alpha_thresholds()
    verify_energy_conservation()
    verify_normal_form()
    verify_lindstedt()
    verify_near_circular()
    plot_figure1()
```

Output of `python appendix_a.py`:

```text
python 3.12.3, sympy 1.14.0, numpy 2.4.4, scipy 1.17.1, matplotlib 3.10.8

     E      r_-      r_+    D_abs  (V3/E)_steep  D_range
--------------------------------------------------------
 0.050   0.3633   0.2895   0.3196        0.1618   0.4813
  1/12   0.5000   0.3660   0.5000        0.1962   0.6962
 0.100   0.5671   0.3976   0.6078        0.2095   0.8174
   1/8   0.6736   0.4397   0.8152        0.2267   1.0419
 0.150   0.8042   0.4771   1.1558        0.2413   1.3971
 0.165   0.9411   0.4978   1.6838        0.2492   1.9330
  1/6-   1.0000   0.5000   2.0000        0.2500   2.2500

LaTeX rows:
0.050 & 0.3633 & 0.2895 & 0.3196 & 0.1618 & 0.4813 \\
1/12 & 0.5000 & 0.3660 & 0.5000 & 0.1962 & 0.6962 \\
0.100 & 0.5671 & 0.3976 & 0.6078 & 0.2095 & 0.8174 \\
1/8 & 0.6736 & 0.4397 & 0.8152 & 0.2267 & 1.0419 \\
0.150 & 0.8042 & 0.4771 & 1.1558 & 0.2413 & 1.3971 \\
0.165 & 0.9411 & 0.4978 & 1.6838 & 0.2492 & 1.9330 \\
1/6- & 1.0000 & 0.5000 & 2.0000 & 0.2500 & 2.2500 \\

E=1/12 exact: r_+=(sqrt3-1)/2, r_+^3/(3E)=3sqrt3-5=0.1961524227, numerical=0.1961524227
D_abs(0.05)=0.3196, ratio D(1/6)/D(0.05)=6.259
D_abs=1 at E=9/64=0.140625 (computed 0.140625)

Small-E asymptotics, D_abs vs (2*sqrt(2)/3)*sqrt(E)*(1 + sqrt(2E)):
  E=1e-05: D/lead = 1.00450, 1+sqrt(2E) = 1.00447
  E=1e-04: D/lead = 1.01438, 1+sqrt(2E) = 1.01414
  E=1e-03: D/lead = 1.04720, 1+sqrt(2E) = 1.04472
  E=1e-02: D/lead = 1.16994, 1+sqrt(2E) = 1.14142
  (at E=0.05 the leading term alone gives 0.2108 vs D_abs = 0.3196: it is a small-E check only)
E=0.0200: max|V3|=0.003366 (grid) vs r_-^3/3=0.003368;  max V3=0.002219 vs r_+^3/3=0.002233
E=0.0500: max|V3|=0.015932 (grid) vs r_-^3/3=0.015978;  max V3=0.008087 vs r_+^3/3=0.008089
E=0.0833: max|V3|=0.041583 (grid) vs r_-^3/3=0.041667;  max V3=0.016286 vs r_+^3/3=0.016346
E=0.1000: max|V3|=0.060776 (grid) vs r_-^3/3=0.060784;  max V3=0.020951 vs r_+^3/3=0.020953
E=0.1500: max|V3|=0.173155 (grid) vs r_-^3/3=0.173369;  max V3=0.036174 vs r_+^3/3=0.036196
E=0.1650: max|V3|=0.277416 (grid) vs r_-^3/3=0.277832;  max V3=0.041086 vs r_+^3/3=0.041112
Lemma 1 checks passed (boundary, monotonicity, brute force).

Attainability of fixed alpha (geometrically attainable iff E >= E_alpha):
  alpha=0.05: r_alpha=0.1429, E_alpha=0.006024
  alpha=0.10: r_alpha=0.2727, E_alpha=0.010300
  alpha=0.25: r_alpha=0.3000, E_alpha=0.036000
  alpha=0.50: r_alpha=0.5000, E_alpha=0.083333
  alpha=0.75: r_alpha=0.6429, E_alpha=0.118076
  alpha=1.00: r_alpha=0.7500, E_alpha=0.140625

Energy conservation check: max|J+V3-E| = 2.45e-13

Homological eq. {H2,chi3}=H3 residual: 0
Lie series exp(ad_chi): cubic terms vanish; quartic = (1/2){chi3,H3}: True

Resonant quartic coefficients, j+k = l+m = 2 (exponents of a1, a2, a1*, a2*):
  a1^0 a2^2 a1*^0 a2*^2: H4= -5/12  target= -5/12  OK
  a1^0 a2^2 a1*^1 a2*^1: H4=     0  target=     0  OK
  a1^0 a2^2 a1*^2 a2*^0: H4= -7/12  target= -7/12  OK
  a1^1 a2^1 a1*^0 a2*^2: H4=     0  target=     0  OK
  a1^1 a2^1 a1*^1 a2*^1: H4=   1/3  target=   1/3  OK
  a1^1 a2^1 a1*^2 a2*^0: H4=     0  target=     0  OK
  a1^2 a2^0 a1*^0 a2*^2: H4= -7/12  target= -7/12  OK
  a1^2 a2^0 a1*^1 a2*^1: H4=     0  target=     0  OK
  a1^2 a2^0 a1*^2 a2*^0: H4= -5/12  target= -5/12  OK
All 9 match; H4_res - target = 0 exactly

Stokes brackets: {S1,S2}= 2*I*a1*a2s - 2*I*a1s*a2  {S2,S3}= 2*a1*a1s - 2*a2*a2s  {S3,S1}= 2*a1*a2s + 2*a1s*a2
  {S1,S2} = +2 S3, {S2,S3} = +2 S1, {S3,S1} = +2 S2: all asserted

At y=0: y'' = -x^2 (nonzero) -> x-axis is NOT invariant.
y-axis orbit, E=0.005: omega=0.995783, 1-5E/6=0.995833, diff=-5.04e-05, diff/E^2=-2.02
y-axis orbit, E=0.01 : omega=0.991461, 1-5E/6=0.991667, diff=-2.05e-04, diff/E^2=-2.05
y-axis orbit, E=0.02 : omega=0.982480, 1-5E/6=0.983333, diff=-8.53e-04, diff/E^2=-2.13
y-axis orbit, E=0.04 : omega=0.962955, 1-5E/6=0.966667, diff=-3.71e-03, diff/E^2=-2.32

Near-circular initial conditions: mean |dphi/dt| vs 1 + E/3
E=0.005: omega=1.0016361, 1+E/3=1.0016667, diff/E^2=-1.22
E=0.01: omega=1.0032325, 1+E/3=1.0033333, diff/E^2=-1.01
E=0.02: omega=1.0061882, 1+E/3=1.0066667, diff/E^2=-1.20
E=0.04: omega=1.0114805, 1+E/3=1.0133333, diff/E^2=-1.16

Figure 1 saved to figure1.{pdf,png}
```

---

## References

[1] M. Hénon and C. Heiles, Astron. J. **69**, 73 (1964).
[2] G. Contopoulos, Astron. J. **75**, 96 (1970).
[3] A. J. Lichtenberg and M. A. Lieberman, *Regular and Chaotic Dynamics*, 2nd ed. (Springer, 1992).
[4] J. Milnor, *Morse Theory* (Princeton University Press, 1963).
[5] A. Hatcher, *Algebraic Topology* (Cambridge University Press, 2002).
[6] A. Deprit, Celest. Mech. **1**, 12 (1969).
[7] G. Hori, Publ. Astron. Soc. Jpn. **18**, 287 (1966).
[8] A. H. Nayfeh, *Perturbation Methods* (Wiley, 1973).
[9] R. S. MacKay, J. D. Meiss, and I. C. Percival, Physica D **13**, 55 (1984).
[10] J. D. Meiss, Rev. Mod. Phys. **64**, 795 (1992).
[11] F. G. Gustavson, Astron. J. **71**, 670 (1966).
[12] M. Hénon, Physica D **5**, 412 (1982).
[13] E. L. Kaplan and P. Meier, J. Am. Stat. Assoc. **53**, 457 (1958).