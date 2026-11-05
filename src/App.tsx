import { FormEvent, useMemo, useState } from "react"
import cafeInterior from "./assets/cafe-interior.png"
import { EMAILJS } from "./emailjs.config"

type SendState = "idle" | "sending" | "success" | "error"

const productPhotos = [
  {
    name: "Latte Mythos",
    description: "Espresso, leche cremosa y un toque de vainilla.",
    price: "$5.90",
    image:
      "https://images.unsplash.com/photo-1718925830719-0f72c8544d03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=800",
    alt: "Latte y pastry servidos sobre una mesa",
  },
  {
    name: "Brunch de la casa",
    description: "Pan artesanal, huevos suaves y verdes frescos.",
    price: "$12.50",
    image:
      "https://images.unsplash.com/photo-1661750646636-d9a565c6c55c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=800",
    alt: "Plato de brunch artesanal",
  },
  {
    name: "Croissant almendra",
    description: "Horneado cada mañana, crujiente y delicado.",
    price: "$4.20",
    image:
      "https://images.unsplash.com/photo-1563520506621-9c3a3587aea1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=800",
    alt: "Croissant artesanal servido en un plato",
  },
]

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12.5 4 4L19 7" />
  </svg>
)

export default function App() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<SendState>("idle")

  const isConfigured = useMemo(
    () =>
      Object.values(EMAILJS).every((value) => value && !value.startsWith("TU_")),
    [],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || state === "sending") return
    setState("sending")

    // Antes: si faltaban las credenciales se simulaba un "éxito" falso.
    // Ahora mostramos error para no engañar al usuario.
    if (!isConfigured) {
      console.error("Faltan las credenciales de EmailJS en src/emailjs.config.ts")
      setState("error")
      return
    }

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: EMAILJS.serviceId,
            template_id: EMAILJS.templateId,
            user_id: EMAILJS.publicKey,
            template_params: {
              // "To Email" en EmailJS debe ser {{user_email}}
              user_email: email,
              subscriber_name: email.split("@")[0].toUpperCase(),
              discount_code: "MYTHOS15",
            },
          }),
        },
      )
      if (!response.ok) {
        // EmailJS responde con el motivo del error en texto plano
        throw new Error(`EmailJS ${response.status}: ${await response.text()}`)
      }
      setState("success")
    } catch (error) {
      console.error(error)
      setState("error")
    }
  }

  return (
    <main>
      <nav className="nav">
        <a className="logo" href="#" aria-label="Mythos Café, inicio">
          <span className="logo-flower">A</span>
          <span>MYTHOS</span>
          <small>CAFÉ · PAN · ENCUENTROS</small>
        </a>
        <div className="nav-links">
          <a href="#favoritos">Carta</a>
          <a href="#historia">Nuestra casa</a>
          <a href="#club">Club Mythos</a>
        </div>
        <a className="nav-button" href="#club">
          Visítanos <PinIcon />
        </a>
      </nav>

      <section className="hero">
        <div className="photo-panel">
          <img
            src={cafeInterior}
            alt="Interior luminoso de Mythos Café con árboles florales y mobiliario azul"
          />
          <div className="photo-shade" />
          <div className="photo-copy">
            <span className="eyebrow light">UN RINCÓN PARA QUEDARTE</span>
            <p>
              Café de especialidad, cocina honesta
              <br />y tardes que se alargan.
            </p>
          </div>
          <div className="open-card">
            <span className="open-dot" />
            <div>
              <small>ABIERTO HOY</small>
              <strong>8:00 — 20:00</strong>
            </div>
            <ClockIcon />
          </div>
        </div>

        <div className="offer-panel" id="club">
          <div className="offer-inner">
            <span className="eyebrow">BIENVENIDO A TU NUEVO CAFÉ FAVORITO</span>
            <h1>
              Ven por el café.
              <br />
              <em>Quédate por la experiencia.</em>
            </h1>
            <p className="lead">
              Únete al Club Mythos y recibe un <strong>15% de descuento</strong>{" "}
              en tu primera visita, además de invitaciones a catas, lanzamientos
              y mesas especiales.
            </p>

            {state === "success" ? (
              <div className="coupon-card" aria-live="polite">
                <div className="coupon-check">
                  <CheckIcon />
                </div>
                <div>
                  <span>TU BENEFICIO ESTÁ LISTO</span>
                  <strong>MYTHOS15</strong>
                  <p>También lo enviamos a {email}</p>
                </div>
              </div>
            ) : (
              <form className="coffee-form" onSubmit={handleSubmit}>
                <label htmlFor="email">¿A DÓNDE ENVIAMOS TU BENEFICIO?</label>
                <div className="coffee-input">
                  <MailIcon />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (state === "error") setState("idle")
                    }}
                    required
                    autoComplete="email"
                  />
                  <button type="submit" disabled={state === "sending"}>
                    {state === "sending" ? "Preparando..." : "Obtener mi 15%"}
                    <ArrowIcon />
                  </button>
                </div>
                <p className={`form-message ${state}`}>
                  {state === "error"
                    ? "No pudimos enviarlo. Inténtalo nuevamente."
                    : "Sin spam. Solo café, planes bonitos y beneficios reales."}
                </p>
              </form>
            )}

            <div className="mini-proof">
              <div className="avatars">
                <span>MC</span>
                <span>AL</span>
                <span>JP</span>
              </div>
              <div>
                <div className="stars" aria-label="5 de 5 estrellas">
                  ★★★★★
                </div>
                <p>Más de 2,400 personas ya son parte del club.</p>
              </div>
            </div>
          </div>

          <div className="scroll-note">
            <span>DESCUBRE LA CARTA</span>
            <i />
          </div>
        </div>
      </section>

      <section className="favorites" id="favoritos">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOS IMPERDIBLES</span>
            <h2>Hechos para acompañar tu momento.</h2>
          </div>
          <a href="#favoritos">
            Ver carta completa <ArrowIcon />
          </a>
        </div>

        <div className="product-grid">
          {productPhotos.map((product, index) => (
            <article className="product-card" key={product.name}>
              <div className="product-image">
                <img src={product.image} alt={product.alt} />
                <span>0{index + 1}</span>
              </div>
              <div className="product-info">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="historia">
        <p>“Cada taza tiene una historia. La nuestra empieza contigo.”</p>
        <div>
          <span>
            <PinIcon /> Paseo del Jardín 24
          </span>
          <span>
            <ClockIcon /> Lun — Dom · 8:00 a 20:00
          </span>
        </div>
      </section>
    </main>
  )
}
