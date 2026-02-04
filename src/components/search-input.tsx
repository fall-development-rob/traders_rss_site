'use client';

import * as React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Called when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Called when user presses Enter */
  onSubmit?: () => void;
  /** Called when the clear button is clicked */
  onClear?: () => void;
  /** Show keyboard shortcut hint */
  showShortcut?: boolean;
  /** Called when shortcut key is pressed (Cmd+K / Ctrl+K) */
  onShortcut?: () => void;
}

/**
 * Inline search input component for the header
 * Features debounced search, clear button, and search icon
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search articles...',
  className,
  disabled = false,
  onSubmit,
  onClear,
  showShortcut = false,
  onShortcut,
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = React.useCallback(() => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit?.();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
        inputRef.current?.blur();
      }
    },
    [onSubmit, handleClear]
  );

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  React.useEffect(() => {
    if (!onShortcut) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onShortcut();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [onShortcut]);

  const hasValue = value.length > 0;

  return (
    <div className={cn('relative flex items-center', className)}>
      <SearchIcon
        className={cn(
          'absolute left-3 h-4 w-4 transition-colors',
          isFocused ? 'text-foreground' : 'text-muted-foreground'
        )}
      />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'pl-9 pr-9',
          showShortcut && !hasValue && 'pr-16'
        )}
        aria-label="Search articles"
      />
      {hasValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          className="absolute right-2 h-5 w-5 rounded-full"
          aria-label="Clear search"
        >
          <XIcon className="h-3 w-3" />
        </Button>
      )}
      {showShortcut && !hasValue && (
        <kbd
          className="pointer-events-none absolute right-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex"
          aria-hidden="true"
        >
          <span className="text-xs">
            {typeof navigator !== 'undefined' &&
            navigator.platform?.toLowerCase().includes('mac')
              ? '\u2318'
              : 'Ctrl'}
          </span>
          K
        </kbd>
      )}
    </div>
  );
}
