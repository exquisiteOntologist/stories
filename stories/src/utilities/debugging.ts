/**
 * Sticky elements with parents that have any `overflow` style rules
 * will not stick.
 */
export const findStickyParents = () => {
    let parent = document.querySelector('.sticky').parentElement;

    while (parent) {
        const hasOverflow = getComputedStyle(parent).overflow;
        if (hasOverflow !== 'visible') {
            console.log(hasOverflow, parent);
        }
        parent = parent.parentElement;
    }
}