# Style Guide

## CSS/SCSS Class Naming

We use a simple namespace-container pattern to scope component styles:

### `nsc-` Prefix (Namespace Container)

The `nsc-` prefix is **only used on the top-level element** of a component. It creates a contained style scope for that component.

**Nested elements within the component do NOT use the `nsc-` prefix.**

#### Example:

```scss
// ✓ Good
.nsc-modal {
  border: none;
  background: white;

  .modal-content {
    padding: 2rem;
  }

  .modal-close {
    position: absolute;
    cursor: pointer;
  }
}
```

```scss
// ✗ Bad
.nsc-modal {
  .nsc-modal-content {  // Don't use nsc- on nested elements
    padding: 2rem;
  }

  .nsc-modal-close {    // Don't use nsc- on nested elements
    cursor: pointer;
  }
}
```

### Benefits

- **Clear scoping**: Only the root element is namespaced
- **Cleaner nesting**: Child selectors are simpler
- **Less verbose**: Reduces repetition in class names
- **Easier maintenance**: Changes to the namespace only affect one place

### Usage in Components

```tsx
// modal.tsx
export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <dialog className="nsc-modal">
      <div className="modal-content">
        <button className="modal-close">✕</button>
        {children}
      </div>
    </dialog>
  );
}
```

---

**Key rule**: Use `nsc-` on the root element only. Nested elements are scoped by the parent and don't need the prefix.
