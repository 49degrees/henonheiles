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
