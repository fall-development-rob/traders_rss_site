"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// Constants - Common ARIA Roles
// =============================================================================

export const ARIA_ROLES = {
  // Landmark roles
  BANNER: "banner",
  COMPLEMENTARY: "complementary",
  CONTENTINFO: "contentinfo",
  FORM: "form",
  MAIN: "main",
  NAVIGATION: "navigation",
  REGION: "region",
  SEARCH: "search",

  // Widget roles
  ALERT: "alert",
  ALERTDIALOG: "alertdialog",
  BUTTON: "button",
  CHECKBOX: "checkbox",
  DIALOG: "dialog",
  GRIDCELL: "gridcell",
  LINK: "link",
  LOG: "log",
  MARQUEE: "marquee",
  MENUITEM: "menuitem",
  MENUITEMCHECKBOX: "menuitemcheckbox",
  MENUITEMRADIO: "menuitemradio",
  OPTION: "option",
  PROGRESSBAR: "progressbar",
  RADIO: "radio",
  SCROLLBAR: "scrollbar",
  SEARCHBOX: "searchbox",
  SLIDER: "slider",
  SPINBUTTON: "spinbutton",
  STATUS: "status",
  SWITCH: "switch",
  TAB: "tab",
  TABPANEL: "tabpanel",
  TEXTBOX: "textbox",
  TIMER: "timer",
  TOOLTIP: "tooltip",
  TREEITEM: "treeitem",

  // Document structure roles
  ARTICLE: "article",
  CELL: "cell",
  COLUMNHEADER: "columnheader",
  DEFINITION: "definition",
  DIRECTORY: "directory",
  DOCUMENT: "document",
  FEED: "feed",
  FIGURE: "figure",
  GROUP: "group",
  HEADING: "heading",
  IMG: "img",
  LIST: "list",
  LISTITEM: "listitem",
  MATH: "math",
  NONE: "none",
  NOTE: "note",
  PRESENTATION: "presentation",
  ROW: "row",
  ROWGROUP: "rowgroup",
  ROWHEADER: "rowheader",
  SEPARATOR: "separator",
  TABLE: "table",
  TERM: "term",
  TOOLBAR: "toolbar",

  // Live region roles
  LIVE: "live",
  POLITE: "polite",
  ASSERTIVE: "assertive",
} as const;

export type AriaRole = (typeof ARIA_ROLES)[keyof typeof ARIA_ROLES];

// =============================================================================
// Politeness levels for announcements
// =============================================================================

export const POLITENESS_LEVELS = {
  OFF: "off",
  POLITE: "polite",
  ASSERTIVE: "assertive",
} as const;

export type PolitenessLevel =
  (typeof POLITENESS_LEVELS)[keyof typeof POLITENESS_LEVELS];

// =============================================================================
// VisuallyHidden Component
// =============================================================================

export interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  focusable?: boolean;
}

/**
 * VisuallyHidden component renders content that is visually hidden but
 * accessible to screen readers. Useful for providing context that is
 * visually apparent but needs to be explicitly stated for assistive technology.
 *
 * @example
 * <VisuallyHidden>Loading complete</VisuallyHidden>
 * <button>
 *   <Icon name="close" />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({
  children,
  as: Component = "span",
  focusable = false,
}: VisuallyHiddenProps): React.ReactElement {
  return React.createElement(
    Component,
    {
      className: "sr-only",
      ...(focusable && { tabIndex: 0 }),
    },
    children
  );
}

// =============================================================================
// SkipLink Component
// =============================================================================

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * SkipLink component provides a skip-to-content link for keyboard users.
 * The link is visually hidden until focused, then appears at the top of the page.
 *
 * @example
 * // In your layout component
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 * // Later in your page
 * <main id="main-content">...</main>
 */
export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
  className = "",
}: SkipLinkProps): React.ReactElement {
  return React.createElement(
    "a",
    {
      href,
      className: `skip-link ${className}`.trim(),
    },
    children
  );
}

// =============================================================================
// ARIA Label Helper Functions
// =============================================================================

/**
 * Generates an aria-label for a button with an icon-only design
 * @param action - The action the button performs (e.g., "close", "submit", "delete")
 * @param target - Optional target of the action (e.g., "dialog", "form", "item")
 */
export function generateButtonLabel(action: string, target?: string): string {
  if (target) {
    return `${action} ${target}`;
  }
  return action;
}

/**
 * Generates an aria-label for a link that opens in a new tab
 * @param linkText - The visible text of the link
 */
export function generateExternalLinkLabel(linkText: string): string {
  return `${linkText} (opens in new tab)`;
}

/**
 * Generates an aria-label for a loading state
 * @param itemName - The name of the item being loaded
 * @param isLoading - Whether the item is currently loading
 */
export function generateLoadingLabel(
  itemName: string,
  isLoading: boolean
): string {
  return isLoading ? `Loading ${itemName}` : `${itemName} loaded`;
}

/**
 * Generates an aria-label for a toggle button
 * @param label - The base label for the toggle
 * @param isActive - Whether the toggle is currently active
 */
export function generateToggleLabel(label: string, isActive: boolean): string {
  return `${label}, currently ${isActive ? "on" : "off"}`;
}

/**
 * Generates an aria-label for a count badge
 * @param itemType - The type of items being counted (e.g., "notifications", "messages")
 * @param count - The number of items
 */
export function generateCountLabel(itemType: string, count: number): string {
  if (count === 0) {
    return `No ${itemType}`;
  }
  if (count === 1) {
    return `1 ${itemType.endsWith("s") ? itemType.slice(0, -1) : itemType}`;
  }
  return `${count} ${itemType}`;
}

/**
 * Generates an aria-label for pagination
 * @param currentPage - The current page number
 * @param totalPages - The total number of pages
 */
export function generatePaginationLabel(
  currentPage: number,
  totalPages: number
): string {
  return `Page ${currentPage} of ${totalPages}`;
}

/**
 * Generates an aria-label for a form field with validation state
 * @param fieldName - The name of the form field
 * @param isValid - Whether the field value is valid
 * @param errorMessage - Optional error message when invalid
 */
export function generateFieldLabel(
  fieldName: string,
  isValid: boolean,
  errorMessage?: string
): string {
  if (isValid) {
    return fieldName;
  }
  return errorMessage ? `${fieldName}, ${errorMessage}` : `${fieldName}, invalid`;
}

/**
 * Generates an aria-label for an expandable section
 * @param sectionName - The name of the section
 * @param isExpanded - Whether the section is currently expanded
 */
export function generateExpandableLabel(
  sectionName: string,
  isExpanded: boolean
): string {
  return `${sectionName}, ${isExpanded ? "expanded" : "collapsed"}`;
}

/**
 * Generates an aria-label for a sortable column header
 * @param columnName - The name of the column
 * @param sortDirection - The current sort direction ("ascending", "descending", or "none")
 */
export function generateSortLabel(
  columnName: string,
  sortDirection: "ascending" | "descending" | "none"
): string {
  if (sortDirection === "none") {
    return `${columnName}, sortable`;
  }
  return `${columnName}, sorted ${sortDirection}`;
}

/**
 * Generates an aria-label for a progress indicator
 * @param taskName - The name of the task in progress
 * @param percentage - The completion percentage (0-100)
 */
export function generateProgressLabel(
  taskName: string,
  percentage: number
): string {
  if (percentage === 0) {
    return `${taskName}, not started`;
  }
  if (percentage === 100) {
    return `${taskName}, complete`;
  }
  return `${taskName}, ${percentage}% complete`;
}

// =============================================================================
// useFocusManagement Hook
// =============================================================================

export interface UseFocusManagementOptions {
  /** Whether to restore focus when unmounting */
  restoreFocusOnUnmount?: boolean;
  /** Whether to trap focus within a container */
  trapFocus?: boolean;
  /** Selector for focusable elements */
  focusableSelector?: string;
}

export interface UseFocusManagementReturn {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Focus the first focusable element in the container */
  focusFirst: () => void;
  /** Focus the last focusable element in the container */
  focusLast: () => void;
  /** Focus a specific element by selector */
  focusElement: (selector: string) => void;
  /** Save current focus for later restoration */
  saveFocus: () => void;
  /** Restore previously saved focus */
  restoreFocus: () => void;
  /** Get all focusable elements in the container */
  getFocusableElements: () => HTMLElement[];
}

const DEFAULT_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details>summary:first-of-type',
].join(',');

/**
 * Hook for managing focus within a component or container.
 * Useful for modals, dialogs, and other components that need focus trapping.
 *
 * @example
 * function Modal({ isOpen, onClose }) {
 *   const { containerRef, focusFirst, restoreFocus } = useFocusManagement({
 *     restoreFocusOnUnmount: true,
 *     trapFocus: true,
 *   });
 *
 *   useEffect(() => {
 *     if (isOpen) {
 *       focusFirst();
 *     }
 *   }, [isOpen, focusFirst]);
 *
 *   return <div ref={containerRef}>...</div>;
 * }
 */
export function useFocusManagement(
  options: UseFocusManagementOptions = {}
): UseFocusManagementReturn {
  const {
    restoreFocusOnUnmount = false,
    trapFocus = false,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    const elements = containerRef.current.querySelectorAll<HTMLElement>(
      focusableSelector
    );
    return Array.from(elements).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
  }, [focusableSelector]);

  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const focusElement = useCallback((selector: string) => {
    if (!containerRef.current) return;
    const element = containerRef.current.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus();
    }
  }, []);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
    }
  }, []);

  // Focus trap handler
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: If on first element, wrap to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If on last element, wrap to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [trapFocus, getFocusableElements]);

  // Restore focus on unmount
  useEffect(() => {
    if (restoreFocusOnUnmount) {
      saveFocus();
    }

    return () => {
      if (restoreFocusOnUnmount) {
        restoreFocus();
      }
    };
  }, [restoreFocusOnUnmount, saveFocus, restoreFocus]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusElement,
    saveFocus,
    restoreFocus,
    getFocusableElements,
  };
}

// =============================================================================
// useAnnounce Hook
// =============================================================================

export interface UseAnnounceOptions {
  /** Default politeness level for announcements */
  defaultPoliteness?: PolitenessLevel;
  /** Delay before clearing the announcement (ms) */
  clearDelay?: number;
}

export interface UseAnnounceReturn {
  /** Make an announcement to screen readers */
  announce: (message: string, politeness?: PolitenessLevel) => void;
  /** Clear the current announcement */
  clear: () => void;
  /** The current announcement message */
  message: string;
  /** Ref to attach to a live region element (optional, hook creates its own) */
  liveRegionRef: React.RefObject<HTMLDivElement | null>;
  /** Component to render the live region (alternative to using ref) */
  LiveRegion: React.FC<{ className?: string }>;
}

/**
 * Hook for announcing content to screen readers using ARIA live regions.
 * Creates and manages a live region for dynamic content announcements.
 *
 * @example
 * function SearchResults({ results, isLoading }) {
 *   const { announce, LiveRegion } = useAnnounce();
 *
 *   useEffect(() => {
 *     if (!isLoading) {
 *       announce(`Found ${results.length} results`);
 *     }
 *   }, [results, isLoading, announce]);
 *
 *   return (
 *     <>
 *       <LiveRegion />
 *       {results.map(result => ...)}
 *     </>
 *   );
 * }
 */
export function useAnnounce(
  options: UseAnnounceOptions = {}
): UseAnnounceReturn {
  const { defaultPoliteness = POLITENESS_LEVELS.POLITE, clearDelay = 1000 } =
    options;

  const [message, setMessage] = useState("");
  const [politeness, setPoliteness] = useState<PolitenessLevel>(defaultPoliteness);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    setMessage("");
  }, []);

  const announce = useCallback(
    (newMessage: string, newPoliteness?: PolitenessLevel) => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Update politeness if provided
      if (newPoliteness) {
        setPoliteness(newPoliteness);
      }

      // Clear message first to ensure re-announcement of same message
      setMessage("");

      // Use requestAnimationFrame to ensure the DOM updates
      requestAnimationFrame(() => {
        setMessage(newMessage);
      });

      // Schedule clearing the message
      if (clearDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          clear();
        }, clearDelay);
      }
    },
    [clearDelay, clear]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // LiveRegion component
  const LiveRegion: React.FC<{ className?: string }> = useCallback(
    ({ className = "" }) => {
      return React.createElement(
        "div",
        {
          ref: liveRegionRef,
          role: "status",
          "aria-live": politeness,
          "aria-atomic": true,
          className: `sr-only ${className}`.trim(),
        },
        message
      );
    },
    [message, politeness]
  );

  return {
    announce,
    clear,
    message,
    liveRegionRef,
    LiveRegion,
  };
}

// =============================================================================
// Additional Utility Functions
// =============================================================================

/**
 * Checks if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Generates a unique ID for ARIA relationships
 * @param prefix - Prefix for the ID
 */
export function generateAriaId(prefix: string = "aria"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates aria-describedby/aria-labelledby attribute value from multiple IDs
 * @param ids - Array of element IDs
 */
export function combineAriaIds(...ids: (string | undefined | null)[]): string {
  return ids.filter(Boolean).join(" ");
}

/**
 * Returns appropriate aria-pressed value for toggle buttons
 * @param isPressed - Whether the button is pressed/active
 */
export function getAriaPressedValue(
  isPressed: boolean
): "true" | "false" {
  return isPressed ? "true" : "false";
}

/**
 * Returns appropriate aria-expanded value for expandable elements
 * @param isExpanded - Whether the element is expanded
 */
export function getAriaExpandedValue(
  isExpanded: boolean
): "true" | "false" {
  return isExpanded ? "true" : "false";
}

/**
 * Returns appropriate aria-selected value for selectable elements
 * @param isSelected - Whether the element is selected
 */
export function getAriaSelectedValue(
  isSelected: boolean
): "true" | "false" {
  return isSelected ? "true" : "false";
}

/**
 * Returns appropriate aria-checked value for checkable elements
 * @param isChecked - Whether the element is checked
 * @param isIndeterminate - Whether the element is in an indeterminate state
 */
export function getAriaCheckedValue(
  isChecked: boolean,
  isIndeterminate: boolean = false
): "true" | "false" | "mixed" {
  if (isIndeterminate) return "mixed";
  return isChecked ? "true" : "false";
}

/**
 * Returns appropriate aria-sort value for sortable columns
 * @param sortDirection - The current sort direction
 */
export function getAriaSortValue(
  sortDirection: "ascending" | "descending" | "none" | null
): "ascending" | "descending" | "none" | undefined {
  if (sortDirection === null || sortDirection === "none") return undefined;
  return sortDirection;
}
