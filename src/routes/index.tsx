import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  ChefHat,
  Flame,
  Gift,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import products, { type Product } from '@/data/products'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type Cart = Record<string, number>

type OrderResult = {
  orderId: string
  orderCount: number
  loyaltyReward: boolean
  nextRewardIn: number
  subtotal: number
}

function HomePage() {
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id])
        .map((product) => ({ ...product, quantity: cart[product.id] ?? 0 })),
    [cart],
  )
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )

  const changeQuantity = (productId: string, change: number) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[productId] ?? 0) + change)
      const next = { ...current, [productId]: nextQuantity }
      if (nextQuantity === 0) delete next[productId]
      return next
    })
  }

  const handleOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cartItems.length) return

    setSubmitting(true)
    setError('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('nom'),
          phone: formData.get('telephone'),
          address: formData.get('adresse'),
          city: formData.get('ville'),
          notes: formData.get('notes'),
          botField: formData.get('bot-field'),
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      const result = (await response.json()) as OrderResult & { error?: string }
      if (!response.ok) throw new Error(result.error)

      const notification = new URLSearchParams({
        'form-name': 'nouvelle-commande',
        subject: `Nouvelle commande Makrouna Tounsia #${result.orderId.slice(0, 8)}`,
        'order-id': result.orderId,
        nom: String(formData.get('nom') ?? ''),
        telephone: String(formData.get('telephone') ?? ''),
        adresse: String(formData.get('adresse') ?? ''),
        ville: String(formData.get('ville') ?? ''),
        commande: cartItems
          .map((item) => `${item.quantity} × ${item.name}`)
          .join(', '),
        total: `${result.subtotal} DT`,
        fidelite: result.loyaltyReward
          ? 'Dessert offert sur cette commande'
          : `${result.orderCount}/10 commandes`,
        notes: String(formData.get('notes') ?? ''),
        'bot-field': '',
      })

      await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: notification.toString(),
      }).catch(() => undefined)

      setOrderResult(result)
      setCart({})
      form.reset()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Une erreur est survenue. Réessayez.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="Makrouna Tounsia, accueil">
          <span className="brand-mark">MT</span>
          <span>
            <strong>Makrouna</strong>
            <small>Tounsia</small>
          </span>
        </a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#menu" onClick={() => setMenuOpen(false)}>La carte</a>
          <a href="#fidelite" onClick={() => setMenuOpen(false)}>Fidélité</a>
          <a href="#livraison" onClick={() => setMenuOpen(false)}>Livraison</a>
        </nav>
        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
          aria-label={`Ouvrir le panier, ${cartCount} articles`}
        >
          <ShoppingBag size={19} />
          <span>Panier</span>
          <b>{cartCount}</b>
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Ouvrir le menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-copy">
          <div className="eyebrow"><Flame size={16} /> Recettes tunisiennes · Fait maison</div>
          <h1>La vraie <em>makrouna</em>, généreuse et bien relevée.</h1>
          <p>
            Thon, poulpe, fruits de mer, anguille ou bœuf: des plats tunisiens
            cuisinés à la commande et livrés chauds chez vous.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#menu">Voir la carte <span>↓</span></a>
            <div className="delivery-note">
              <span><MapPin size={17} /></span>
              <div><strong>Livraison locale</strong><small>Frais confirmés par téléphone</small></div>
            </div>
          </div>
          <div className="hero-proof">
            <div className="avatars"><span>🌶️</span><span>🍝</span><span>🇹🇳</span></div>
            <div><span className="stars">★★★★★</span><small>Préparé avec le cœur, comme à la maison</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="image-ring">
            <img src="/images/makrouna-tounsia.png" alt="Logo Makrouna Tounsia aux couleurs de la Tunisie" />
          </div>
          <div className="floating-card floating-top"><ChefHat size={18} /><span><b>100% maison</b><small>Sauce mijotée</small></span></div>
          <div className="floating-card floating-bottom"><Gift size={18} /><span><b>10 commandes</b><small>1 dessert offert</small></span></div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>MAKROUNA TOUNSIA <span>✦</span> PIQUANT À VOTRE GOÛT <span>✦</span> PRODUITS FRAIS <span>✦</span> LIVRAISON À DOMICILE <span>✦</span> MAKROUNA TOUNSIA <span>✦</span></div>
      </div>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div>
            <span className="kicker">Notre carte</span>
            <h2>Choisissez votre envie</h2>
          </div>
          <p>Des portions généreuses, une sauce rouge qui a du caractère et le goût authentique de la Tunisie.</p>
        </div>

        <div className="menu-grid">
          {products.map((product, index) => (
            <MenuCard
              key={product.id}
              product={product}
              quantity={cart[product.id] ?? 0}
              index={index}
              onChange={changeQuantity}
            />
          ))}
          <article className="menu-card special-card">
            <div className="special-content">
              <span className="dish-icon">⚔️</span>
              <span className="card-badge">Selon arrivage</span>
              <h3>Espadon du jour</h3>
              <p>Demandez la disponibilité et le prix lors de la confirmation téléphonique.</p>
              <strong>Prix du jour</strong>
            </div>
          </article>
          <article className="menu-card dessert-card">
            <div className="special-content">
              <span className="dish-icon">🍰</span>
              <span className="card-badge light">Surprise maison</span>
              <h3>Dessert du jour</h3>
              <p>Une douceur faite maison qui change selon l’inspiration de la cuisine.</p>
              <strong>Offert à la 10e commande</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="loyalty-section" id="fidelite">
        <div className="loyalty-card">
          <div className="loyalty-copy">
            <span className="kicker light-kicker">Carte fidélité</span>
            <h2>10 commandes.<br /><em>1 dessert offert.</em></h2>
            <p>Votre fidélité est automatiquement suivie avec votre numéro de téléphone. Rien à imprimer, rien à oublier.</p>
            <div className="loyalty-steps">
              <span><Check size={16} /> Commandez</span>
              <span><Check size={16} /> Cumulez</span>
              <span><Gift size={16} /> Régalez-vous</span>
            </div>
          </div>
          <div className="stamp-card">
            <div className="stamp-head"><span>بطاقة الوفاء</span><b>FIDÉLITÉ</b></div>
            <div className="stamps">
              {Array.from({ length: 10 }, (_, index) => (
                <span key={index} className={index < 4 ? 'stamped' : ''}>{index < 4 ? '★' : index + 1}</span>
              ))}
            </div>
            <small>Le même numéro de téléphone à chaque commande</small>
          </div>
        </div>
      </section>

      <section className="delivery-section" id="livraison">
        <div className="delivery-title">
          <span className="kicker">Simple & rapide</span>
          <h2>De notre marmite<br />jusqu’à votre porte.</h2>
        </div>
        <div className="delivery-steps">
          <div><b>01</b><ChefHat /><h3>Composez</h3><p>Ajoutez vos plats préférés au panier.</p></div>
          <div><b>02</b><Phone /><h3>Confirmez</h3><p>Nous vous contactons pour confirmer la commande.</p></div>
          <div><b>03</b><MapPin /><h3>Dégustez</h3><p>Votre repas arrive chaud à l’adresse indiquée.</p></div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#accueil"><span className="brand-mark">MT</span><span><strong>Makrouna</strong><small>Tounsia</small></span></a>
        <p>Spécialités tunisiennes · Préparées avec amour 🇹🇳</p>
        <button onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> Commander maintenant</button>
      </footer>

      {cartCount > 0 && !cartOpen && (
        <button className="mobile-cart" onClick={() => setCartOpen(true)}>
          <span><ShoppingBag size={18} /> {cartCount} article{cartCount > 1 ? 's' : ''}</span>
          <b>{subtotal} DT</b>
        </button>
      )}

      <div className={cartOpen ? 'cart-overlay is-open' : 'cart-overlay'} onClick={() => setCartOpen(false)} />
      <aside className={cartOpen ? 'cart-drawer is-open' : 'cart-drawer'} aria-hidden={!cartOpen}>
        <div className="cart-header">
          <div><span className="kicker">Votre commande</span><h2>Le panier</h2></div>
          <button onClick={() => setCartOpen(false)} aria-label="Fermer le panier"><X /></button>
        </div>

        {orderResult ? (
          <div className="success-state">
            <div className="success-icon"><Check /></div>
            <span className="kicker">Commande reçue</span>
            <h2>Yaatik essa7a !</h2>
            <p>Votre commande <b>#{orderResult.orderId.slice(0, 8)}</b> est enregistrée. Nous vous contactons bientôt pour confirmer la livraison.</p>
            {orderResult.loyaltyReward ? (
              <div className="reward-message"><Gift /><span><b>Dessert offert !</b><small>C’est votre 10e commande.</small></span></div>
            ) : (
              <div className="reward-message"><Star /><span><b>Fidélité: {orderResult.orderCount}/10</b><small>Encore {orderResult.nextRewardIn} commande{orderResult.nextRewardIn > 1 ? 's' : ''} avant votre dessert.</small></span></div>
            )}
            <button className="primary-button full" onClick={() => { setOrderResult(null); setCartOpen(false) }}>Fermer</button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart"><span>🍝</span><h3>Votre panier a faim</h3><p>Ajoutez un plat de la carte pour commencer.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Voir la carte</button></div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <span className="cart-item-icon">{item.icon}</span>
                  <div><h3>{item.name}</h3><b>{item.price * item.quantity} DT</b></div>
                  <QuantityControl quantity={item.quantity} onMinus={() => changeQuantity(item.id, -1)} onPlus={() => changeQuantity(item.id, 1)} />
                </div>
              ))}
            </div>
            <div className="cart-total"><span>Sous-total</span><b>{subtotal} DT</b><small>Frais de livraison confirmés par téléphone</small></div>
            <form className="order-form" onSubmit={handleOrder}>
              <input type="hidden" name="form-name" value="nouvelle-commande" />
              <label className="honeypot">Ne pas remplir<input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
              <div className="field-row"><label>Nom et prénom<input name="nom" required minLength={2} placeholder="Votre nom" /></label><label>Téléphone<input name="telephone" required inputMode="tel" minLength={8} placeholder="Ex. 22 000 000" /></label></div>
              <div className="field-row"><label>Ville<input name="ville" required placeholder="Votre ville" /></label><label>Adresse<input name="adresse" required minLength={5} placeholder="Rue, numéro..." /></label></div>
              <label>Note pour la cuisine ou la livraison<textarea name="notes" rows={3} placeholder="Niveau de piquant, repère, étage..." /></label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-button full" disabled={submitting} type="submit">
                {submitting ? 'Enregistrement...' : <>Confirmer · {subtotal} DT <span>→</span></>}
              </button>
              <p className="form-note">Paiement à la livraison · Confirmation par téléphone</p>
            </form>
          </>
        )}
      </aside>
    </main>
  )
}

function MenuCard({ product, quantity, index, onChange }: { product: Product; quantity: number; index: number; onChange: (id: string, change: number) => void }) {
  return (
    <article className={`menu-card ${index === 1 ? 'featured' : ''}`}>
      <div className="menu-card-top">
        <span className="dish-icon">{product.icon}</span>
        {product.badge && <span className="card-badge">{product.badge}</span>}
      </div>
      <div className="menu-card-copy"><span className="category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
      <div className="menu-card-bottom"><strong>{product.price} <small>DT</small></strong>{quantity > 0 ? <QuantityControl quantity={quantity} onMinus={() => onChange(product.id, -1)} onPlus={() => onChange(product.id, 1)} /> : <button className="add-button" onClick={() => onChange(product.id, 1)} aria-label={`Ajouter ${product.name}`}><Plus size={19} /> Ajouter</button>}</div>
    </article>
  )
}

function QuantityControl({ quantity, onMinus, onPlus }: { quantity: number; onMinus: () => void; onPlus: () => void }) {
  return <div className="quantity"><button type="button" onClick={onMinus} aria-label="Retirer un article"><Minus size={15} /></button><b>{quantity}</b><button type="button" onClick={onPlus} aria-label="Ajouter un article"><Plus size={15} /></button></div>
}
