# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Editorial"

This design system moves away from the sterile, "template-locked" feel of standard utility apps. Our Creative North Star is **The Kinetic Editorial**. We treat user data not as a spreadsheet, but as a premium fitness journal. By combining the geometric precision of high-end performance brands with the spaciousness of modern editorial layouts, we create an environment that feels both professional and deeply motivating.

To break the "standard app" look, we lean into intentional asymmetry, oversized display typography, and a "layered paper" philosophy. We avoid rigid grids in favor of breathable white space and overlapping elements that suggest movement and progress.

## 2. Colors

The palette is designed to trigger specific psychological states: refreshing clarity for hydration (Primary Blue) and high-octane energy for physical exertion (Secondary Orange/Tertiary Green).

- **The "No-Line" Rule:** To maintain a high-end feel, **do not use 1px solid borders** to section content. Traditional lines create visual clutter and make an app feel "boxed in." Boundaries must be defined strictly through background color shifts. For example, a card using `surface-container-lowest` should sit on a background of `surface-container-low`.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers.
    - **Base:** `surface` (#f8fafb)
    - **Sections:** `surface-container-low` (#f2f4f5)
    - **Primary Content Cards:** `surface-container-lowest` (#ffffff) for a "lifted" look.
    - **Interactive Overlays:** `surface-container-highest` (#e1e3e4).
- **The "Glass & Gradient" Rule:** To provide "soul" to the interface, use Glassmorphism for floating action buttons or navigation bars. Use `surface-tint` with 60% opacity and a 20px backdrop blur. 
- **Signature Textures:** For high-impact areas like water goal completion or gym PRs, apply a subtle linear gradient from `primary` (#00497d) to `primary_container` (#0061a4). This adds a three-dimensional depth that flat hex codes cannot achieve.

## 3. Typography

The system utilizes two distinct typefaces to balance character with utility.

- **Display & Headlines (Lexend):** A geometric sans-serif that exudes confidence. Use `display-lg` (3.5rem) for daily goal progress and `headline-sm` (1.5rem) for section titles like "Monday: Chest & Triceps."
- **Body & Labels (Manrope):** A highly functional, modern sans-serif. Manrope is used for all "workhorse" text. Use `body-md` (0.875rem) for exercise lists to ensure maximum readability during a workout.
- **Hierarchy Strategy:** Create drama through scale. Pair a `display-md` number (e.g., "85%") with a `label-sm` unit ("Daily Intake") to create an authoritative, data-driven look.

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than structural shadows.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift.
- **Ambient Shadows:** When a "floating" effect is necessary (e.g., a "Start Workout" button), use extra-diffused shadows. 
    - **Values:** `0px 12px 32px` with a 6% opacity of `on_surface` (#191c1d). This mimics natural light rather than a harsh digital drop shadow.
- **The "Ghost Border" Fallback:** If a container lacks contrast (e.g., white on white), use a "Ghost Border": `outline-variant` (#c1c7d2) at **15% opacity**. This provides a hint of structure without interrupting the visual flow.
- **Glassmorphism:** Use semi-transparent `surface_container_lowest` for elements like progress overlays, allowing the energetic `secondary` or `tertiary` colors to bleed through subtly.

## 5. Components

### Buttons
- **Primary:** Rounded `lg` (1rem). Use `primary` for water and `secondary` for gym actions. Use a subtle inner glow (top-down gradient) to make the button feel tactile.
- **Tertiary:** No background, `title-sm` typography with an icon. 

### Cards & Lists
- **Forbid Divider Lines:** Never use a horizontal rule to separate list items. Use **Vertical Space** (Spacing scale `4` or `6`) or alternate background tints (`surface-container-low` vs `surface-container-lowest`).
- **Contextual Containers:** Gym sets should be grouped in a `surface-container` with a `secondary` accent bar (4px) on the left side to denote "active" energy.

### Input Fields
- **Styling:** Use `surface_container_highest` for the input background with `none` border. Use `label-md` for floating labels that animate to `label-sm` on focus.

### Additional: Kinetic Progress Rings
- For the water tracker, use a heavy-stroke circular progress bar using `primary` on a `primary_fixed` background. The stroke should have rounded caps (`full`) to match the system's softness.

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Align a headline to the left but place the supporting data (e.g., "12 Reps") in an offset, right-aligned position to create editorial interest.
- **Leverage Spacing Scale:** Use `spacing-10` (2.5rem) between major sections to let the design breathe.
- **Prioritize "On-" Colors:** Ensure text on a `secondary` background always uses `on_secondary` (#ffffff) for WCAG compliance.

### Don't:
- **Don't use 100% Black:** Always use `on_background` (#191c1d) for text to prevent visual fatigue.
- **Don't use "Default" Shadows:** Avoid the small, dark, high-opacity shadows found in basic UI kits.
- **Don't mix Roundedness:** Stick to `lg` (1rem) for cards and `full` for interactive chips. Mixing `sm` and `xl` inappropriately breaks the "Kinetic" harmony.