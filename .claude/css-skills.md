# CSS Naming Conventions

## Class Naming Pattern

Use **hyphenated naming** instead of BEM double underscore syntax.

### ✅ Do This
```scss
.component-name { }
.component-name-title { }
.component-name-grid { }
.component-name-item { }
.component-name-item:hover { }
```

### ❌ Don't Do This
```scss
.component-name { }
.component-name__title { }      // ❌ Avoid double underscore
.component-name__grid { }       // ❌ Avoid double underscore
.component-name__item { }       // ❌ Avoid double underscore
.component-name__item:hover { } // ❌ Avoid double underscore
```

## Pattern Structure

`component-name-element-modifier`

- **component-name**: The main component (e.g., `gallery-display`, `motion-gallery`)
- **element**: Child element or section (e.g., `title`, `grid`, `column`, `item`)
- **modifier**: Optional state/variation (e.g., `empty`, `active`)

### Examples

```scss
// Gallery component
.gallery-display { }
.gallery-display-title { }
.gallery-display-grid { }
.gallery-display-column { }
.gallery-display-item { }
.gallery-display-overlay { }
.gallery-display-icon { }
.gallery-display-empty { }

// Motion gallery
.mg { } // Root kept short
.mg-grid { }
.mg-card { }
.mg-card-pair { }
.mg-detail { }
.mg-overlay { }
.mg-close { }
.mg-nav { }
.mg-nav-prev { }
.mg-nav-next { }

// Icon buttons
.icon-btn { }
.icon-btn-nav { }
.icon-btn-nav-prev { }
.icon-btn-nav-next { }
.icon-btn-close { }
```

## When Using Root Shorthand

For heavily-styled components, a short root class is acceptable:

```scss
.mg { } // Motion gallery root
.mg-detail { }
.mg-overlay { }
```

But prefer full naming for clarity:

```scss
.motion-gallery { } // Better
.motion-gallery-detail { }
.motion-gallery-overlay { }
```

## Modifiers (States)

Use standard modifier syntax when adding state classes:

```scss
.gallery-display-item { }
.gallery-display-item.is-active { }
.gallery-display-item.is-empty { }

.icon-btn { }
.icon-btn.is-disabled { }
```

Or include in the class name directly:

```scss
.gallery-display-empty { } // For component-level states
.gallery-display-item-active { } // For element-level states
```

## Notes

- No underscores (`_`) in class names
- Use hyphens (`-`) to separate all parts
- Keep class names readable and self-documenting
- Avoid deep nesting in SCSS that creates long chains
