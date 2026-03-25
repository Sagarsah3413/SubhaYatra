import { useState, useRef, useEffect } from 'react';

/**
 * Manages calendar open/close state, animation, keyboard trapping, and focus.
 *
 * Returns:
 *   showCalendar      {boolean}
 *   mobileAnimating   {boolean}
 *   calendarRef       {React.RefObject}
 *   triggerRef        {React.RefObject}
 *   handleCalendarOpen {Function}  - pass to the trigger button's onClick
 *   handleCalendarClose {Function} - call to close with animation
 */
export const useCalendar = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [mobileAnimating, setMobileAnimating] = useState(false);

    const calendarRef = useRef(null);
    const triggerRef = useRef(null);
    const previousActive = useRef(null);

    // Open handler
    const handleCalendarOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerRef.current = e.currentTarget;
        setShowCalendar(true);
        setMobileAnimating(false); // reset – animation kicks in via useEffect below
    };

    // Close handler (with slide-out animation)
    const handleCalendarClose = () => {
        setMobileAnimating(false);
        setTimeout(() => setShowCalendar(false), 350);
    };

    // Trigger slide-in animation after calendar mounts
    useEffect(() => {
        if (showCalendar && !mobileAnimating) {
            const timer = setTimeout(() => setMobileAnimating(true), 50);
            return () => clearTimeout(timer);
        }
    }, [showCalendar, mobileAnimating]);

    // Click-outside to close
    useEffect(() => {
        function handleClickOutside(e) {
            if (!showCalendar) return;
            const inModal = e.target.closest('[role="dialog"]');
            const inButton = e.target.closest('button[aria-haspopup="dialog"]');
            if (!inModal && !inButton) {
                handleCalendarClose();
            }
        }
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 200);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCalendar, mobileAnimating]);

    // Escape key + Tab trap
    useEffect(() => {
        function handleKey(e) {
            if (!showCalendar) return;

            if (e.key === 'Escape') {
                handleCalendarClose();
                return;
            }

            if (e.key === 'Tab' && calendarRef.current) {
                const focusable = calendarRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                } else {
                    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCalendar, mobileAnimating]);

    // Focus management
    useEffect(() => {
        if (showCalendar) {
            previousActive.current = document.activeElement;
            const timer = setTimeout(() => {
                if (calendarRef.current) {
                    const focusable = calendarRef.current.querySelectorAll(
                        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    );
                    (focusable[0] || calendarRef.current).focus();
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            try {
                previousActive.current?.focus();
            } catch (error) {
                console.debug("Focus restore failed", error);
            }
        }
    }, [showCalendar]);

    return {
        showCalendar,
        mobileAnimating,
        calendarRef,
        triggerRef,
        handleCalendarOpen,
        handleCalendarClose,
        setShowCalendar,
        setMobileAnimating,
    };
};