import { useState } from "react";

// TODO: Integrar con API real de MadMuscles para autenticación
// TODO: Obtener datos reales de suscripción del usuario
// TODO: Cargar rutinas de ejercicio desde backend

const COLORS = {
  primary40: "#ff6025",
  primary50: "#ff4400",
  primary60: "#e03c00",
  primary200: "#35221b",
  black100: "#121212",
  black90: "#171717",
  black80: "#1e1e1e",
  black70: "#2a2a2a",
  black60: "#393939",
  black50: "#4f4f4f",
  black40: "#6a6a6a",
  black30: "#8d8d8d",
  black20: "#b3b3b3",
  black10: "#dadada",
  black5: "#ededed",
  black0: "#ffffff",
  green50: "#43a687",
  green60: "#1e8565",
  lime40: "#a8ff66",
  lime50: "#97f64f",
  red50: "#e22336",
  yellow30: "#f9ad29",
  blue50: "#1371dc",
  brown90: "#352319",
  brown100: "#2a1b13",
};

const Logo = () => (
  <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="'Arial Black', sans-serif" fontSize="22" fontWeight="900" fill={COLORS.primary40} letterSpacing="-1">
      MAD
    </text>
    <text x="52" y="24" fontFamily="'Arial Black', sans-serif" fontSize="22" fontWeight="900" fill={COLORS.black0} letterSpacing="-1">
      MUSCLES
    </text>
  </svg>
);

const IconDumbbell = ({ size = 20, color = COLORS.primary40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h2v5H3zM19 9.5h2v5h-2zM6.5 6.5v11M17.5 6.5v11" />
  </svg>
);

const IconUser = ({ size = 20, color = COLORS.black20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLock = ({ size = 20, color = COLORS.black20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = ({ size = 18, color = COLORS.black30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ size = 18, color = COLORS.black30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconCheck = ({ size = 16, color = COLORS.lime40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCalendar = ({ size = 20, color = COLORS.primary40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconStar = ({ size = 16, color = COLORS.yellow30, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconFire = ({ size = 20, color = COLORS.primary40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 2C9 6 6 8 6 12a6 6 0 0 0 12 0c0-3-2-6-4-8-1 2-2 3-2 4.5 0 1.5 1 2.5 2 3-2.5 0-4-2-4-4 0-1.5.5-2.5 2-3.5z" />
  </svg>
);

const IconArrow = ({ size = 16, color = COLORS.black0, direction = "right" }) => {
  const rotate = direction === "left" ? "180" : direction === "up" ? "-90" : direction === "down" ? "90" : "0";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotate}deg)` }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

const IconHome = ({ size = 22, color = COLORS.black30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconCard = ({ size = 22, color = COLORS.black30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconSettings = ({ size = 22, color = COLORS.black30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── PANTALLA DE SIGN IN ─────────────────────────────────────────────────────
function SignInScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    // TODO: Reemplazar con llamada real a API de autenticación
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, name: "Usuario MadMuscles" });
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.black100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: "absolute",
        top: "-20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(255,96,37,0.15) 0%, rgba(255,68,0,0) 100%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <Logo />
        <p style={{ color: COLORS.black30, fontSize: "13px", marginTop: "8px", letterSpacing: "0.05em" }}>
          PROGRAMA PERSONALIZADO DE ENTRENAMIENTO
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: COLORS.black80,
        borderRadius: "20px",
        padding: "36px 32px",
        border: `1px solid ${COLORS.black60}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{
          color: COLORS.black0,
          fontSize: "26px",
          fontWeight: "800",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}>
          Iniciar sesión
        </h2>
        <p style={{ color: COLORS.black30, fontSize: "14px", marginBottom: "28px" }}>
          Accede a tu plan de entrenamiento personalizado
        </p>

        {error && (
          <div style={{
            background: "rgba(226,35,54,0.15)",
            border: `1px solid ${COLORS.red50}`,
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#f98994",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: COLORS.black20, fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Correo electrónico
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: COLORS.black70,
              border: `1.5px solid ${focusedField === "email" ? COLORS.primary40 : COLORS.black60}`,
              borderRadius: "12px",
              padding: "0 16px",
              transition: "border-color 0.2s",
            }}>
              <IconUser size={18} color={focusedField === "email" ? COLORS.primary40 : COLORS.black40} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="tu@email.com"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: COLORS.black0,
                  fontSize: "15px",
                  padding: "14px 12px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ color: COLORS.black20, fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Contraseña
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: COLORS.black70,
              border: `1.5px solid ${focusedField === "password" ? COLORS.primary40 : COLORS.black60}`,
              borderRadius: "12px",
              padding: "0 16px",
              transition: "border-color 0.2s",
            }}>
              <IconLock size={18} color={focusedField === "password" ? COLORS.primary40 : COLORS.black40} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: COLORS.black0,
                  fontSize: "15px",
                  padding: "14px 12px",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <span style={{ color: COLORS.primary40, fontSize: "13px", cursor: "pointer" }}>
                {/* TODO: Implementar flujo de recuperación de contraseña */}
                ¿Olvidaste tu contraseña?
              </span>
            </div>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading
                ? COLORS.black60
                : `linear-gradient(135deg, ${COLORS.primary40} 0%, ${COLORS.primary50} 100%)`,
              border: "none",
              borderRadius: "14px",
              color: COLORS.black0,
              fontSize: "16px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : `0 8px 24px rgba(255,96,37,0.4)`,
              fontFamily: "inherit",
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: COLORS.black60 }} />
          <span style={{ color: COLORS.black40, fontSize: "13px", margin: "0 12px" }}>o continúa con</span>
          <div style={{ flex: 1, height: "1px", background: COLORS.black60 }} />
        </div>

        {/* Social buttons */}
        {/* TODO: Implementar autenticación con Google y Apple */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["Google", "Apple"].map((provider) => (
            <button
              key={provider}
              style={{
                flex: 1,
                padding: "13px",
                background: COLORS.black70,
                border: `1.5px solid ${COLORS.black60}`,
                borderRadius: "12px",
                color: COLORS.black0,
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.black40; e.currentTarget.style.background = COLORS.black60; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.black60; e.currentTarget.style.background = COLORS.black70; }}
            >
              {provider}
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", color: COLORS.black30, fontSize: "13px", marginTop: "24px", marginBottom: 0 }}>
          ¿No tienes cuenta?{" "}
          <span style={{ color: COLORS.primary40, fontWeight: "700", cursor: "pointer" }}>
            {/* TODO: Navegar a pantalla de registro */}
            Regístrate gratis
          </span>
        </p>
      </div>

      {/* Footer */}
      <p style={{ color: COLORS.black50, fontSize: "12px", marginTop: "24px", textAlign: "center" }}>
        © 2024 MadMuscles · Todos los derechos reservados
      </p>
    </div>
  );
}

// ─── BARRA DE NAVEGACIÓN INFERIOR ────────────────────────────────────────────
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "dashboard", label: "Inicio", icon: IconHome },
    { id: "workout", label: "Entrena", icon: IconDumbbell },
    { id: "subscription", label: "Plan", icon: IconCard },
    { id: "profile", label: "Perfil", icon: IconSettings },
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: COLORS.black80,
      borderTop: `1px solid ${COLORS.black60}`,
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 20px",
      zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "4px 12px",
              transition: "all 0.2s",
            }}
          >
            <Icon size={22} color={isActive ? COLORS.primary40 : COLORS.black40} />
            <span style={{
              fontSize: "11px",
              fontWeight: isActive ? "700" : "500",
              color: isActive ? COLORS.primary40 : COLORS.black40,
              fontFamily: "inherit",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── CABECERA ─────────────────────────────────────────────────────────────────
function Header({ user, onLogout }) {
  return (
    <div style={{
      background: COLORS.black90,
      borderBottom: `1px solid ${COLORS.black70}`,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <Logo />
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary60})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          fontSize: "14px",
          color: COLORS.black0,
        }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: `1px solid ${COLORS.black60}`,
            borderRadius: "8px",
            padding: "6px 12px",
            color: COLORS.black30,
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.black40; e.currentTarget.style.color = COLORS.black0; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.black60; e.currentTarget.style.color = COLORS.black30; }}
        >
          Salir
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ user }) {
  // TODO: Obtener datos reales del progreso del usuario desde la API
  const stats = [
    { label: "Racha actual", value: "7 días", icon: IconFire, color: COLORS.primary40 },
    { label: "Entrenamientos", value: "24", icon: IconDumbbell, color: COLORS.blue50 },
    { label: "Calorías quemadas", value: "8.4k", icon: IconFire, color: COLORS.yellow30 },
    { label: "Días activos", value: "18/30", icon: IconCalendar, color: COLORS.green50 },
  ];

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
  const completedDays = [true, true, true, false, false, false, false];

  const recentWorkouts = [
    { name: "Pecho y Tríceps", duration: "45 min", calories: 320, difficulty: "Intermedio", emoji: "💪" },
    { name: "Espalda y Bíceps", duration: "50 min", calories: 380, difficulty: "Avanzado", emoji: "🏋️" },
    { name: "Piernas y Glúteos", duration: "55 min", calories: 450, difficulty: "Intermedio", emoji: "🦵" },
  ];

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      {/* Saludo */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.brown90} 0%, ${COLORS.black80} 100%)`,
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "20px",
        border: `1px solid rgba(255,96,37,0.2)`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          right: "-20px",
          top: "-20px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(50% 50% at 50% 50%, rgba(255,96,37,0.2) 0%, transparent 100%)",
        }} />
        <p style={{ color: COLORS.primary40, fontSize: "13px", fontWeight: "700", marginBottom: "4px", letterSpacing: "0.05em" }}>
          BIENVENIDO DE VUELTA
        </p>
        <h2 style={{ color: COLORS.black0, fontSize: "24px", fontWeight: "900", marginBottom: "8px" }}>
          {user?.name || "Atleta"} 🔥
        </h2>
        <p style={{ color: COLORS.black30, fontSize: "14px", marginBottom: "16px" }}>
          Tienes 3 entrenamientos pendientes esta semana
        </p>
        <button style={{
          background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`,
          border: "none",
          borderRadius: "12px",
          padding: "12px 20px",
          color: COLORS.black0,
          fontSize: "14px",
          fontWeight: "800",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: `0 6px 20px rgba(255,96,37,0.4)`,
          transition: "all 0.2s",
        }}>
          Iniciar entrenamiento del día →
        </button>
      </div>

      {/* Progreso semanal */}
      <div style={{
        background: COLORS.black80,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        border: `1px solid ${COLORS.black60}`,
      }}>
        <h3 style={{ color: COLORS.black0, fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
          Progreso semanal
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
          {weekDays.map((day, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: completedDays[i]
                  ? `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`
                  : COLORS.black70,
                border: completedDays[i] ? "none" : `1px solid ${COLORS.black60}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {completedDays[i] && <IconCheck size={14} color={COLORS.black0} />}
              </div>
              <span style={{ fontSize: "12px", color: completedDays[i] ? COLORS.primary40 : COLORS.black40, fontWeight: "600" }}>
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "20px",
      }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            background: COLORS.black80,
            borderRadius: "16px",
            padding: "18px",
            border: `1px solid ${COLORS.black60}`,
          }}>
            <Icon size={20} color={color} />
            <div style={{ fontSize: "22px", fontWeight: "900", color: COLORS.black0, marginTop: "8px" }}>
              {value}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.black30, marginTop: "4px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Entrenamientos recientes */}
      <div>
        <h3 style={{ color: COLORS.black0, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
          Entrenamientos recientes
        </h3>
        {recentWorkouts.map((w, i) => (
          <div key={i} style={{
            background: COLORS.black80,
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "10px",
            border: `1px solid ${COLORS.black60}`,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.black50; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.black60; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: COLORS.black70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0,
            }}>
              {w.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.black0, fontSize: "15px", fontWeight: "700" }}>{w.name}</div>
              <div style={{ color: COLORS.black30, fontSize: "12px", marginTop: "2px" }}>
                {w.duration} · {w.calories} kcal · {w.difficulty}
              </div>
            </div>
            <IconArrow size={16} color={COLORS.black40} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PANTALLA DE ENTRENAMIENTO ────────────────────────────────────────────────
function WorkoutScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  // TODO: Cargar rutinas reales desde API de MadMuscles
  const categories = ["Todos", "Pecho", "Espalda", "Piernas", "Hombros", "Cardio", "Core"];

  const workouts = [
    { name: "Pecho Explosivo", level: "Avanzado", duration: "45 min", exercises: 8, emoji: "💪", color: COLORS.primary40 },
    { name: "Espalda Fuerte", level: "Intermedio", duration: "40 min", exercises: 7, emoji: "🏋️", color: COLORS.blue50 },
    { name: "Piernas de Hierro", level: "Avanzado", duration: "55 min", exercises: 10, emoji: "🦵", color: COLORS.green50 },
    { name: "Core Abdominal", level: "Principiante", duration: "30 min", exercises: 6, emoji: "🎯", color: COLORS.yellow30 },
    { name: "HIIT Quema Grasa", level: "Intermedio", duration: "25 min", exercises: 12, emoji: "🔥", color: COLORS.red50 },
    { name: "Hombros Definidos", level: "Intermedio", duration: "38 min", exercises: 7, emoji: "💿", color: "#9f89f5" },
  ];

  const getLevelColor = (level) => {
    if (level === "Principiante") return COLORS.green50;
    if (level === "Intermedio") return COLORS.yellow30;
    return COLORS.red50;
  };

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h2 style={{ color: COLORS.black0, fontSize: "24px", fontWeight: "900", marginBottom: "6px" }}>
        Tu Plan de Entrenamiento
      </h2>
      <p style={{ color: COLORS.black30, fontSize: "14px", marginBottom: "20px" }}>
        Programa personalizado · Semana 3
      </p>

      {/* Categorías */}
      <div style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "4px",
        marginBottom: "20px",
        scrollbarWidth: "none",
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              whiteSpace: "nowrap",
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background: selectedCategory === cat
                ? `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`
                : COLORS.black70,
              color: selectedCategory === cat ? COLORS.black0 : COLORS.black30,
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Entrenamiento del día destacado */}
      <div style={{
        background: `linear-gradient(135deg, rgba(255,96,37,0.2) 0%, ${COLORS.black80} 100%)`,
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px",
        border: `1px solid rgba(255,96,37,0.3)`,
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}>
          <div>
            <span style={{
              background: COLORS.primary40,
              color: COLORS.black0,
              fontSize: "11px",
              fontWeight: "700",
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.05em",
            }}>
              HOY
            </span>
            <h3 style={{ color: COLORS.black0, fontSize: "20px", fontWeight: "900", marginTop: "8px", marginBottom: "4px" }}>
              💪 Pecho y Tríceps
            </h3>
            <p style={{ color: COLORS.black30, fontSize: "13px" }}>8 ejercicios · 45 min · 320 kcal</p>
          </div>
          <div style={{ fontSize: "40px" }}>🏆</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{
            flex: 1,
            padding: "13px",
            background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`,
            border: "none",
            borderRadius: "12px",
            color: COLORS.black0,
            fontSize: "14px",
            fontWeight: "800",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: `0 6px 20px rgba(255,96,37,0.4)`,
          }}>
            Comenzar ahora
          </button>
          <button style={{
            padding: "13px 16px",
            background: COLORS.black70,
            border: `1px solid ${COLORS.black60}`,
            borderRadius: "12px",
            color: COLORS.black20,
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Vista previa
          </button>
        </div>
      </div>

      {/* Lista de workouts */}
      <h3 style={{ color: COLORS.black0, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
        Biblioteca de entrenamientos
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {workouts.map((w, i) => (
          <div key={i} style={{
            background: COLORS.black80,
            borderRadius: "16px",
            padding: "16px",
            border: `1px solid ${COLORS.black60}`,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = w.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.black60; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{w.emoji}</div>
            <div style={{ color: COLORS.black0, fontSize: "14px", fontWeight: "700", marginBottom: "4px", lineHeight: "1.3" }}>
              {w.name}
            </div>
            <div style={{
              display: "inline-block",
              background: `${getLevelColor(w.level)}22`,
              color: getLevelColor(w.level),
              fontSize: "11px",
              fontWeight: "700",
              padding: "2px 8px",
              borderRadius: "6px",
              marginBottom: "8px",
            }}>
              {w.level}
            </div>
            <div style={{ color: COLORS.black40, fontSize: "12px" }}>
              {w.duration} · {w.exercises} ejercicios
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PANTALLA DE SUSCRIPCIÓN ──────────────────────────────────────────────────
function SubscriptionScreen() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  // TODO: Obtener datos reales de suscripción desde API
  // TODO: Integrar con pasarela de pago para gestión de facturas

  const currentPlan = {
    name: "Plan Pro",
    price: "$9.99",
    period: "mes",
    renewDate: "15 de enero, 2025",
    status: "Activo",
    features: [
      "Programa personalizado ilimitado",
      "Más de 200 ejercicios en video",
      "Seguimiento de progreso",
      "Nutrición y recetas",
      "Soporte prioritario",
      "Sin anuncios",
    ],
  };

  const plans = [
    {
      name: "Mensual",
      price: "$9.99",
      period: "/mes",
      popular: false,
      description: "Ideal para empezar",
    },
    {
      name: "Trimestral",
      price: "$7.99",
      period: "/mes",
      popular: true,
      description: "Ahorra 20%",
      badge: "MÁS POPULAR",
    },
    {
      name: "Anual",
      price: "$4.99",
      period: "/mes",
      popular: false,
      description: "Ahorra 50%",
      badge: "MEJOR VALOR",
    },
  ];

  const invoices = [
    { date: "15 dic 2024", amount: "$9.99", status: "Pagado" },
    { date: "15 nov 2024", amount: "$9.99", status: "Pagado" },
    { date: "15 oct 2024", amount: "$9.99", status: "Pagado" },
  ];

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h2 style={{ color: COLORS.black0, fontSize: "24px", fontWeight: "900", marginBottom: "6px" }}>
        Mi Suscripción
      </h2>
      <p style={{ color: COLORS.black30, fontSize: "14px", marginBottom: "20px" }}>
        Gestiona tu plan y facturación
      </p>

      {/* Plan actual */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.brown90} 0%, ${COLORS.black70} 100%)`,
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "20px",
        border: `1px solid rgba(255,96,37,0.3)`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: COLORS.primary40,
          padding: "6px 16px",
          borderBottomLeftRadius: "12px",
          fontSize: "12px",
          fontWeight: "800",
          color: COLORS.black0,
          letterSpacing: "0.05em",
        }}>
          ● {currentPlan.status.toUpperCase()}
        </div>

        <div style={{ marginTop: "8px" }}>
          <div style={{ color: COLORS.black20, fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
            PLAN ACTUAL
          </div>
          <div style={{ color: COLORS.black0, fontSize: "28px", fontWeight: "900", marginBottom: "4px" }}>
            {currentPlan.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
            <span style={{ color: COLORS.primary40, fontSize: "26px", fontWeight: "900" }}>
              {currentPlan.price}
            </span>
            <span style={{ color: COLORS.black30, fontSize: "14px" }}>/{currentPlan.period}</span>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <IconCalendar size={16} color={COLORS.black30} />
            <span style={{ color: COLORS.black20, fontSize: "13px" }}>
              Próxima renovación: <strong style={{ color: COLORS.black0 }}>{currentPlan.renewDate}</strong>
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {currentPlan.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <IconCheck size={14} color={COLORS.lime40} />
                <span style={{ color: COLORS.black20, fontSize: "12px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cambiar plan */}
      <h3 style={{ color: COLORS.black0, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
        Cambiar plan
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            background: plan.popular ? `linear-gradient(135deg, rgba(255,96,37,0.15) 0%, ${COLORS.black80} 100%)` : COLORS.black80,
            borderRadius: "16px",
            padding: "18px",
            border: `1.5px solid ${plan.popular ? COLORS.primary40 : COLORS.black60}`,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary40; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = plan.popular ? COLORS.primary40 : COLORS.black60; }}
          >
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: `2px solid ${plan.popular ? COLORS.primary40 : COLORS.black50}`,
              background: plan.popular ? COLORS.primary40 : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {plan.popular && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.black0 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: COLORS.black0, fontSize: "15px", fontWeight: "700" }}>{plan.name}</span>
                {plan.badge && (
                  <span style={{
                    background: plan.popular ? COLORS.primary40 : COLORS.green50,
                    color: COLORS.black0,
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    letterSpacing: "0.05em",
                  }}>
                    {plan.badge}
                  </span>
                )}
              </div>
              <span style={{ color: COLORS.black40, fontSize: "13px" }}>{plan.description}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: plan.popular ? COLORS.primary40 : COLORS.black0, fontSize: "18px", fontWeight: "900" }}>
                {plan.price}
              </div>
              <div style={{ color: COLORS.black40, fontSize: "12px" }}>{plan.period}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón actualizar */}
      <button style={{
        width: "100%",
        padding: "16px",
        background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`,
        border: "none",
        borderRadius: "14px",
        color: COLORS.black0,
        fontSize: "15px",
        fontWeight: "800",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: `0 8px 24px rgba(255,96,37,0.35)`,
        marginBottom: "20px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 12px 30px rgba(255,96,37,0.45)`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(255,96,37,0.35)`; }}
      >
        Actualizar plan
      </button>

      {/* Historial de facturas */}
      <h3 style={{ color: COLORS.black0, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
        Historial de pagos
      </h3>
      <div style={{
        background: COLORS.black80,
        borderRadius: "16px",
        border: `1px solid ${COLORS.black60}`,
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        {invoices.map((inv, i) => (
          <div key={i} style={{
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: i < invoices.length - 1 ? `1px solid ${COLORS.black70}` : "none",
          }}>
            <div>
              <div style={{ color: COLORS.black0, fontSize: "14px", fontWeight: "600" }}>{inv.date}</div>
              <div style={{ color: COLORS.black40, fontSize: "12px" }}>Plan Pro · Mensual</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: COLORS.black0, fontWeight: "700" }}>{inv.amount}</span>
              <span style={{
                background: "rgba(67,166,135,0.15)",
                color: COLORS.green50,
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 10px",
                borderRadius: "6px",
              }}>
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cancelar */}
      <button
        onClick={() => setShowCancelModal(true)}
        style={{
          width: "100%",
          padding: "14px",
          background: "transparent",
          border: `1.5px solid rgba(226,35,54,0.4)`,
          borderRadius: "14px",
          color: COLORS.red50,
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(226,35,54,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        Cancelar suscripción
      </button>

      {/* Modal cancelar */}
      {showCancelModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(18,18,18,0.92)",
          display: "flex",
          alignItems: "flex-end",
          zIndex: 200,
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setShowCancelModal(false)}
        >
          <div
            style={{
              width: "100%",
              background: COLORS.black80,
              borderRadius: "24px 24px 0 0",
              padding: "32px 24px 40px",
              border: `1px solid ${COLORS.black60}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: "40px", height: "4px", background: COLORS.black60, borderRadius: "2px", margin: "0 auto 24px" }} />
            <h3 style={{ color: COLORS.black0, fontSize: "20px", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
              ¿Cancelar suscripción?
            </h3>
            <p style={{ color: COLORS.black30, fontSize: "14px", textAlign: "center", marginBottom: "24px", lineHeight: "1.6" }}>
              Perderás acceso a todos tus programas personalizados, historial de entrenamientos y características premium al final del período actual.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary50})`,
                  border: "none",
                  borderRadius: "12px",
                  color: COLORS.black0,
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Mantener plan
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "transparent",
                  border: `1.5px solid ${COLORS.black60}`,
                  borderRadius: "12px",
                  color: COLORS.black40,
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {/* TODO: Implementar flujo real de cancelación */}
                Cancelar de todos modos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA DE PERFIL ───────────────────────────────────────────────────────
function ProfileScreen({ user, onLogout }) {
  // TODO: Obtener y guardar datos reales del perfil desde API
  const profileItems = [
    { label: "Datos personales", icon: "👤", description: "Nombre, edad, peso, altura" },
    { label: "Mis objetivos", icon: "🎯", description: "Pérdida de grasa, ganancia muscular" },
    { label: "Notificaciones", icon: "🔔", description: "Recordatorios de entrenamiento" },
    { label: "Idioma", icon: "🌍", description: "Español" },
    { label: "Privacidad", icon: "🔒", description: "Gestión de datos y cookies" },
    { label: "Ayuda y soporte", icon: "💬", description: "FAQ, chat en vivo" },
  ];

  const stats = [
    { label: "Semanas", value: "12" },
    { label: "Entrenamientos", value: "47" },
    { label: "Horas", value: "38" },
  ];

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      {/* Avatar y nombre */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "24px",
        paddingTop: "12px",
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.primary40}, ${COLORS.primary60})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "900",
          color: COLORS.black0,
          marginBottom: "12px",
          boxShadow: `0 8px 24px rgba(255,96,37,0.4)`,
        }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <h2 style={{ color: COLORS.black0, fontSize: "22px", fontWeight: "900", marginBottom: "4px" }}>
          {user?.name || "Usuario"}
        </h2>
        <p style={{ color: COLORS.black40, fontSize: "14px", marginBottom: "4px" }}>
          {user?.email || "usuario@email.com"}
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(255,96,37,0.12)",
          padding: "4px 14px",
          borderRadius: "20px",
        }}>
          <span style={{ fontSize: "12px" }}>⭐</span>
          <span style={{ color: COLORS.primary40, fontSize: "13px", fontWeight: "700" }}>Plan Pro Activo</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: COLORS.black80,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        border: `1px solid ${COLORS.black60}`,
        display: "flex",
        justifyContent: "space-around",
      }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: COLORS.primary40, fontSize: "24px", fontWeight: "900" }}>{value}</div>
            <div style={{ color: COLORS.black40, fontSize: "12px", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Reseña */}
      <div style={{
        background: COLORS.black80,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
        border: `1px solid ${COLORS.black60}`,
      }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
          {[1, 2, 3, 4, 5].map((s) => <IconStar key={s} size={16} color={COLORS.yellow30} filled />)}
        </div>
        <p style={{ color: COLORS.black20, fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          "MadMuscles cambió completamente mi forma de entrenar. Los programas personalizados son increíbles."
        </p>
        <span style={{ color: COLORS.black40, fontSize: "12px" }}>Tu reseña · hace 2 meses</span>
      </div>

      {/* Opciones de perfil */}
      <div style={{
        background: COLORS.black80,
        borderRadius: "16px",
        border: `1px solid ${COLORS.black60}`,
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        {profileItems.map((item, i) => (
          <div key={i} style={{
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            borderBottom: i < profileItems.length - 1 ? `1px solid ${COLORS.black70}` : "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.black70; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: "20px", width: "24px", textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.black0, fontSize: "14px", fontWeight: "600" }}>{item.label}</div>
              <div style={{ color: COLORS.black40, fontSize: "12px" }}>{item.description}</div>
            </div>
            <IconArrow size={14} color={COLORS.black50} />
          </div>
        ))}
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={onLogout}
        style={{
          width: "100%",
          padding: "14px",
          background: COLORS.black80,
          border: `1.5px solid ${COLORS.black60}`,
          borderRadius: "14px",
          color: COLORS.black20,
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.red50; e.currentTarget.style.color = COLORS.red50; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.black60; e.currentTarget.style.color = COLORS.black20; }}
      >
        Cerrar sesión
      </button>

      <p style={{ textAlign: "center", color: COLORS.black50, fontSize: "12px", marginTop: "20px" }}>
        MadMuscles v2.4.1 · Términos · Privacidad
      </p>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("dashboard");
  };

  if (!user) {
    return <SignInScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardScreen user={user} />;
      case "workout":
        return <WorkoutScreen />;
      case "subscription":
        return <SubscriptionScreen />;
      case "profile":
        return <ProfileScreen user={user} onLogout={handleLogout} />;
      default:
        return <DashboardScreen user={user} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.black100,
      maxWidth: "480px",
      margin: "0 auto",
      position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.8)",
    }}>
      <Header user={user} onLogout={handleLogout} />
      <main style={{ minHeight: "calc(100vh - 65px)" }}>
        {renderScreen()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}