import { FormEvent, MouseEvent, PointerEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Gift,
  Heart,
  HeartHandshake,
  Leaf,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  sale: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
  tag: string;
};

type Cart = Record<string, number>;

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const products: Product[] = [
  {
    id: 'pink-lily-bouquet',
    name: 'Blush Lily Crochet Bouquet',
    category: 'Flowers',
    price: 1299,
    oldPrice: 1699,
    sale: 25,
    image: '/images/pink-lily-bouquet.jpeg',
    imageWidth: 533,
    imageHeight: 775,
    description: 'Soft pink lilies wrapped with satin ribbon for birthdays and keepsakes.',
    tag: 'Best seller',
  },
  {
    id: 'sunflower-bouquet',
    name: 'Sunbeam Sunflower Bouquet',
    category: 'Flowers',
    price: 999,
    oldPrice: 1299,
    sale: 20,
    image: '/images/sunflower-bouquet.jpeg',
    imageWidth: 533,
    imageHeight: 775,
    description: 'A warm, hand-crocheted sunflower pair finished with a crisp white bow.',
    tag: 'Opening sale',
  },
  {
    id: 'mini-tulip-bouquet',
    name: 'Mini Tulip Set of 3',
    category: 'Flowers',
    price: 799,
    oldPrice: 999,
    sale: 15,
    image: '/images/mini-tulip-bouquet.jpeg',
    imageWidth: 300,
    imageHeight: 436,
    description: 'Three red tulips tucked into black wrap for a compact romantic gift.',
    tag: 'New',
  },
  {
    id: 'rose-basket',
    name: 'Rose Keepsake Basket',
    category: 'Flowers',
    price: 899,
    oldPrice: 1199,
    sale: 25,
    image: '/images/rose-basket.jpeg',
    imageWidth: 300,
    imageHeight: 450,
    description: 'A mini basket filled with red crochet roses and tiny white blossoms.',
    tag: 'Gift ready',
  },
  {
    id: 'sunflower-pot',
    name: 'Sunflower Crochet Pot',
    category: 'Decor',
    price: 1199,
    oldPrice: 1399,
    sale: 10,
    image: '/images/sunflower-pot.jpeg',
    imageWidth: 300,
    imageHeight: 447,
    description: 'A cheerful table pot with twin sunflowers and textured wool leaves.',
    tag: 'Home decor',
  },
  {
    id: 'gift-box',
    name: 'Floreal Gift Box',
    category: 'Gifts',
    price: 1899,
    oldPrice: 2399,
    sale: 20,
    image: '/images/gift-box.png',
    imageWidth: 300,
    imageHeight: 400,
    description: 'A curated hamper with crochet bloom, treats, candle, and keepsake notes.',
    tag: 'Limited',
  },
  {
    id: 'teddy-booties',
    name: 'Teddy & Booties Set',
    category: 'Plush',
    price: 1499,
    oldPrice: 1799,
    sale: 15,
    image: '/images/teddy-booties.jpeg',
    imageWidth: 533,
    imageHeight: 782,
    description: 'A plush teddy companion with matching soft booties for baby gifting.',
    tag: 'Baby gift',
  },
  {
    id: 'heart-pillow',
    name: 'Red Heart Pillow',
    category: 'Decor',
    price: 999,
    oldPrice: 1199,
    sale: 10,
    image: '/images/heart-pillow.jpeg',
    imageWidth: 300,
    imageHeight: 341,
    description: 'A bright wool heart cushion made for anniversaries and cozy corners.',
    tag: 'Made to order',
  },
  {
    id: 'batman-bouquet',
    name: 'Batman Mini Bouquet',
    category: 'Custom',
    price: 1099,
    oldPrice: 1299,
    sale: 15,
    image: '/images/batman-bouquet.jpeg',
    imageWidth: 300,
    imageHeight: 442,
    description: 'A playful character bouquet for superhero fans and custom party gifts.',
    tag: 'Custom',
  },
  {
    id: 'ruby-necklace',
    name: 'Ruby Bloom Pendant',
    category: 'Accessories',
    price: 1299,
    oldPrice: 1499,
    sale: 12,
    image: '/images/ruby-necklace.png',
    imageWidth: 300,
    imageHeight: 336,
    description: 'A floral-inspired pendant for styling alongside handmade gift boxes.',
    tag: 'Accessory',
  },
];

const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];

const testimonials = [
  {
    name: 'Aarohi M.',
    text: 'The sunflower bouquet looked exactly like the photo and felt so thoughtfully packed.',
    item: 'Sunbeam Sunflower Bouquet',
  },
  {
    name: 'Nila K.',
    text: 'Floreal made a custom gift box for my sister. The tiny crochet details were beautiful.',
    item: 'Floreal Gift Box',
  },
  {
    name: 'Rehan S.',
    text: 'The heart pillow arrived soft, bright, and gift-ready. It instantly became a desk favorite.',
    item: 'Red Heart Pillow',
  },
];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Catalog', href: '#catalog' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'About Us', href: '#about' },
];

function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  document.getElementById(id)?.scrollIntoView({ block: 'start', behavior });
}

function motionSafeBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('featured');
  const [cart, setCart] = useState<Cart>(() => ({
    'pink-lily-bouquet': 1,
    'rose-basket': 1,
  }));
  const [wishlist, setWishlist] = useState<string[]>(['gift-box', 'heart-pillow']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('FLO-2048');
  const [trackingSearched, setTrackingSearched] = useState(true);

  useEffect(() => {
    const scrollTimers: number[] = [];

    function queueHashScroll() {
      const id = window.location.hash.slice(1);
      if (!id) return;

      [0, 120, 360].forEach((delay) => {
        const timer = window.setTimeout(() => scrollToSection(id, 'auto'), delay);
        scrollTimers.push(timer);
      });
    }

    queueHashScroll();
    window.addEventListener('hashchange', queueHashScroll);
    return () => {
      window.removeEventListener('hashchange', queueHashScroll);
      scrollTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function handleInternalLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith('#')) return;

    const id = href.slice(1);
    if (!document.getElementById(id)) return;

    event.preventDefault();
    window.history.pushState(null, '', href);
    scrollToSection(id, motionSafeBehavior());
    setMenuOpen(false);
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextProducts = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...nextProducts].sort((a, b) => {
      if (sortMode === 'price-low') return a.price - b.price;
      if (sortMode === 'price-high') return b.price - a.price;
      if (sortMode === 'sale') return b.sale - a.sale;
      return products.findIndex((product) => product.id === a.id) - products.findIndex((product) => product.id === b.id);
    });
  }, [activeCategory, searchTerm, sortMode]);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const product = products.find((item) => item.id === id);
          return product ? { product, quantity } : null;
        })
        .filter((line): line is { product: Product; quantity: number } => Boolean(line)),
    [cart],
  );

  const wishlistProducts = useMemo(
    () => wishlist.map((id) => products.find((item) => item.id === id)).filter((item): item is Product => Boolean(item)),
    [wishlist],
  );

  const cartCount = cartLines.reduce((total, line) => total + line.quantity, 0);
  const cartSubtotal = cartLines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const cartSavings = cartLines.reduce(
    (total, line) => total + ((line.product.oldPrice ?? line.product.price) - line.product.price) * line.quantity,
    0,
  );

  function addToCart(id: string) {
    setCart((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));
  }

  function decreaseCart(id: string) {
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) - 1;
      if (nextQuantity <= 0) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: nextQuantity };
    });
  }

  function removeFromCart(id: string) {
    setCart((current) => {
      const { [id]: _removed, ...rest } = current;
      return rest;
    });
  }

  function toggleWishlist(id: string) {
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function handleHeroMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
    event.currentTarget.style.setProperty('--tilt-x', `${-y}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x}deg`);
    event.currentTarget.style.setProperty('--parallax-x', `${x * -0.8}px`);
    event.currentTarget.style.setProperty('--parallax-y', `${y * -0.8}px`);
  }

  function resetHeroMove(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    event.currentTarget.style.setProperty('--parallax-x', '0px');
    event.currentTarget.style.setProperty('--parallax-y', '0px');
  }

  function submitTracking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTrackingSearched(Boolean(trackingCode.trim()));
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <AnnouncementBar />

      <header className="site-header">
        <a
          className="brand-mark"
          href="#home"
          aria-label="Floreal home"
          onClick={(event) => handleInternalLinkClick(event, '#home')}
        >
          <span className="brand-emblem">F</span>
          <span>Floreal</span>
        </a>

        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(event) => handleInternalLinkClick(event, link.href)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="icon-button"
            href="#wishlist"
            aria-label="Wishlist"
            data-tooltip="Wishlist"
            onClick={(event) => handleInternalLinkClick(event, '#wishlist')}
          >
            <Heart size={18} />
            <span>{wishlist.length}</span>
          </a>
          <a
            className="icon-button"
            href="#cart"
            aria-label="Cart"
            data-tooltip="Cart"
            onClick={(event) => handleInternalLinkClick(event, '#cart')}
          >
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="main-content">
        <section
          id="home"
          className="hero-stage"
          onPointerMove={handleHeroMove}
          onPointerLeave={resetHeroMove}
        >
          <div className="hero-background" aria-hidden="true">
            <img
              className="hero-bg-image hero-bg-one"
              src="/images/rose-basket.jpeg"
              alt=""
              width="300"
              height="450"
              fetchPriority="high"
            />
            <img
              className="hero-bg-image hero-bg-two"
              src="/images/sunflower-bouquet.jpeg"
              alt=""
              width="533"
              height="775"
              fetchPriority="high"
            />
            <img
              className="hero-bg-image hero-bg-three"
              src="/images/pink-lily-bouquet.jpeg"
              alt=""
              width="533"
              height="775"
              fetchPriority="high"
            />
            {Array.from({ length: 14 }, (_, index) => (
              <span key={index} className={`petal petal-${index + 1}`} />
            ))}
          </div>

          <div className="hero-content">
            <div className="status-pill">
              <Sparkles size={14} />
              Handmade crochet gifts, opening sale live.
            </div>
            <h1>Floreal</h1>
            <p>
              Flower bouquets, wool keepsakes, gift boxes, decor, and custom pieces made with soft yarn and a little
              everyday romance.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#catalog"
                onClick={(event) => handleInternalLinkClick(event, '#catalog')}
              >
                Shop Opening Sale
                <ArrowUpRight size={18} />
              </a>
              <a
                className="button button-secondary"
                href="#tracking"
                onClick={(event) => handleInternalLinkClick(event, '#tracking')}
              >
                Track Order
                <PackageCheck size={18} />
              </a>
            </div>
          </div>

          <div className="hero-product-stack" aria-label="Featured crochet products">
            <article className="hero-product-card card-a">
              <img src="/images/gift-box.png" alt="Floreal gift box" width="300" height="400" fetchPriority="high" />
              <span>Gift boxes</span>
            </article>
            <article className="hero-product-card card-b">
              <img
                src="/images/sunflower-pot.jpeg"
                alt="Crochet sunflower pot"
                width="300"
                height="447"
                fetchPriority="high"
              />
              <span>Desk decor</span>
            </article>
            <article className="hero-product-card card-c">
              <img
                src="/images/heart-pillow.jpeg"
                alt="Red crochet heart pillow"
                width="300"
                height="341"
                fetchPriority="high"
              />
              <span>Custom love notes</span>
            </article>
          </div>
        </section>

        <section className="photo-wall" aria-labelledby="photo-wall-title">
          <div className="section-heading">
            <span className="eyebrow">Studio frames</span>
            <h2 id="photo-wall-title">Crochet pieces that move with the moment.</h2>
            <p>Every frame is a handmade gift idea, from flower bunches to plush keepsakes.</p>
          </div>
          <div className="frame-track" aria-label="Crochet item gallery">
            {products.slice(0, 8).map((product, index) => (
              <figure className={`photo-frame frame-${index + 1}`} key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  width={product.imageWidth}
                  height={product.imageHeight}
                  loading="lazy"
                />
                <figcaption>{product.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="catalog" className="catalog-section" aria-labelledby="catalog-title">
          <div className="section-heading catalog-heading">
            <span className="eyebrow">Catalog</span>
            <h2 id="catalog-title">Opening sale picks for every kind of gift.</h2>
            <p>Browse crochet flowers, decor, plush sets, accessories, and custom handmade bundles.</p>
          </div>

          <div className="catalog-toolbar" aria-label="Catalog controls">
            <div className="search-box">
              <Search size={18} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                name="catalog-search"
                autoComplete="off"
                placeholder="Search flowers, decor, gifts…"
                aria-label="Search catalog"
              />
            </div>
            <label className="select-control">
              <span>Sort</span>
              <select
                name="catalog-sort"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="sale">Biggest sale</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="category-tabs" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? 'is-active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      loading="lazy"
                    />
                    <span className="sale-badge">{product.sale}% off</span>
                    <button
                      type="button"
                      className={isWishlisted ? 'floating-icon is-active' : 'floating-icon'}
                      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      data-tooltip={isWishlisted ? 'Saved' : 'Save'}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="product-content">
                    <div>
                      <p className="product-tag">{product.tag}</p>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="product-footer">
                      <div className="price-stack">
                        <strong>{currency.format(product.price)}</strong>
                        {product.oldPrice ? <span>{currency.format(product.oldPrice)}</span> : null}
                      </div>
                      <button type="button" className="button button-compact" onClick={() => addToCart(product.id)}>
                        <ShoppingBag size={17} />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="testimonials-section" aria-labelledby="testimonials-title">
          <div className="section-heading">
            <span className="eyebrow">Testimonials</span>
            <h2 id="testimonials-title">Soft yarn, sharp little details.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <div className="stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>{testimonial.text}</p>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.item}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="tracking" className="tracking-section" aria-labelledby="tracking-title">
          <div className="section-heading">
            <span className="eyebrow">Tracking</span>
            <h2 id="tracking-title">Follow your Floreal order.</h2>
            <p>Use an order code to see the latest handmade, packed, and delivery milestones.</p>
          </div>

          <div className="tracking-layout">
            <form className="tracking-form" onSubmit={submitTracking}>
              <label htmlFor="tracking-code">Order code</label>
              <div className="tracking-input-row">
                <input
                  id="tracking-code"
                  name="tracking-code"
                  value={trackingCode}
                  onChange={(event) => setTrackingCode(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="FLO-2048…"
                />
                <button className="button button-primary" type="submit">
                  <Truck size={18} />
                  Track
                </button>
              </div>
            </form>

            {trackingSearched ? (
              <div className="tracking-timeline" aria-live="polite">
                {[
                  ['Order received', 'Your request is confirmed and queued for making.'],
                  ['Handmade in progress', 'The selected crochet pieces are being finished.'],
                  ['Packed with care', 'Gift wrap, note card, and box check are complete.'],
                  ['Delivery scheduled', 'Courier pickup is aligned for the next dispatch window.'],
                ].map(([title, body], index) => (
                  <div className={index < 3 ? 'timeline-step is-complete' : 'timeline-step'} key={title}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-title">
          <div className="about-copy">
            <span className="eyebrow">About us</span>
            <h2 id="about-title">A small crochet studio for gifts that stay.</h2>
            <p>
              Floreal is made for the friend who saves ribbons, remembers colors, and loves gifts with a human touch.
              Each piece is crocheted in small batches, wrapped neatly, and tuned for birthdays, proposals, desk decor,
              baby showers, and custom surprises.
            </p>
            <div className="about-stats" aria-label="Floreal highlights">
              <div>
                <strong>25%</strong>
                <span>opening sale</span>
              </div>
              <div>
                <strong>10+</strong>
                <span>gift styles</span>
              </div>
              <div>
                <strong>3-5</strong>
                <span>day dispatch</span>
              </div>
            </div>
          </div>
          <div className="about-image-cluster">
            <img
              className="about-main-img"
              src="/images/teddy-booties.jpeg"
              alt="Crochet teddy and baby booties"
              width="533"
              height="782"
              loading="lazy"
            />
            <img
              className="about-small-img"
              src="/images/rose-basket.jpeg"
              alt="Crochet rose basket"
              width="300"
              height="450"
              loading="lazy"
            />
          </div>
        </section>

        <section className="cart-wishlist-section" aria-labelledby="cart-wishlist-title">
          <div className="section-heading">
            <span className="eyebrow">Cart & wishlist</span>
            <h2 id="cart-wishlist-title">Keep your favorite handmade picks close.</h2>
          </div>

          <div className="cart-wishlist-grid">
            <section id="cart" className="commerce-panel" aria-labelledby="cart-title">
              <div className="panel-heading">
                <h3 id="cart-title">Cart</h3>
                <span>{cartCount} items</span>
              </div>

              {cartLines.length ? (
                <>
                  <div className="line-items">
                    {cartLines.map(({ product, quantity }) => (
                      <article className="line-item" key={product.id}>
                        <img
                          src={product.image}
                          alt={product.name}
                          width={product.imageWidth}
                          height={product.imageHeight}
                          loading="lazy"
                        />
                        <div>
                          <strong>{product.name}</strong>
                          <span>{currency.format(product.price)}</span>
                          <div className="quantity-controls" aria-label={`${product.name} quantity`}>
                            <button type="button" aria-label={`Decrease ${product.name}`} onClick={() => decreaseCart(product.id)}>
                              <Minus size={14} />
                            </button>
                            <span>{quantity}</span>
                            <button type="button" aria-label={`Increase ${product.name}`} onClick={() => addToCart(product.id)}>
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              className="remove-button"
                              aria-label={`Remove ${product.name}`}
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div>
                      <span>Saved</span>
                      <strong>{currency.format(cartSavings)}</strong>
                    </div>
                    <div>
                      <span>Subtotal</span>
                      <strong>{currency.format(cartSubtotal)}</strong>
                    </div>
                    <button className="button button-primary" type="button">
                      <Gift size={18} />
                      Checkout
                    </button>
                  </div>
                </>
              ) : (
                <p className="empty-note">Your cart is ready for flowers, wool decor, and tiny keepsakes.</p>
              )}
            </section>

            <section id="wishlist" className="commerce-panel" aria-labelledby="wishlist-title">
              <div className="panel-heading">
                <h3 id="wishlist-title">Wishlist</h3>
                <span>{wishlist.length} saved</span>
              </div>

              {wishlistProducts.length ? (
                <div className="wishlist-list">
                  {wishlistProducts.map((product) => (
                    <article className="wishlist-item" key={product.id}>
                      <img
                        src={product.image}
                        alt={product.name}
                        width={product.imageWidth}
                        height={product.imageHeight}
                        loading="lazy"
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{currency.format(product.price)}</span>
                      </div>
                      <button type="button" aria-label={`Move ${product.name} to cart`} onClick={() => addToCart(product.id)}>
                        <ShoppingBag size={16} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-note">Saved favorites will appear here.</p>
              )}
            </section>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a
            className="brand-mark footer-brand"
            href="#home"
            aria-label="Floreal home"
            onClick={(event) => handleInternalLinkClick(event, '#home')}
          >
            <span className="brand-emblem">F</span>
            <span>Floreal</span>
          </a>
          <p>Handmade crochet flowers, gifts, decor, and soft wool keepsakes.</p>
        </div>
        <nav aria-label="Footer shop links">
          <h2>Shop</h2>
          <a href="#catalog" onClick={(event) => handleInternalLinkClick(event, '#catalog')}>
            Catalog
          </a>
          <a href="#wishlist" onClick={(event) => handleInternalLinkClick(event, '#wishlist')}>
            Wishlist
          </a>
          <a href="#cart" onClick={(event) => handleInternalLinkClick(event, '#cart')}>
            Cart
          </a>
        </nav>
        <nav aria-label="Footer support links">
          <h2>Support</h2>
          <a href="#tracking" onClick={(event) => handleInternalLinkClick(event, '#tracking')}>
            Tracking
          </a>
          <a href="#about" onClick={(event) => handleInternalLinkClick(event, '#about')}>
            About Us
          </a>
          <a href="mailto:hello@floreal.example">hello@floreal.example</a>
        </nav>
        <div>
          <h2>Promise</h2>
          <p>Small-batch crochet, tidy packaging, and custom color requests whenever yarn allows.</p>
          <div className="footer-icons" aria-label="Floreal values">
            <Leaf size={18} />
            <HeartHandshake size={18} />
            <PackageCheck size={18} />
          </div>
        </div>
      </footer>
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="announcement-bar" aria-label="Opening sale announcement">
      <div className="announcement-track">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index}>Opening sale up to 25% off on handmade crochet gifts</span>
        ))}
      </div>
    </div>
  );
}

export default App;
