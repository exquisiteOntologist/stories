/**
    Forward Filter.
    Filters an array of items by a series of matching unique indexes.
    Once an index or item has been used it isn't used again.
    It is most performant if the items and indexes are in matching sequence.
    (may not be faster as performs copying and deleting...)
*/
export const forwardFilter = <T extends Array<any>>(items: T, selection: number[], selector: (i: T[0]) => number): T => {
    const results: Array<T[0]> = [];
    const selecting: Array<number> = [...selection];

    for (const item of items) {
        const itemIndex = selector(item);
        for (let i = 0; i < selection.length; i++) {
            const s = selection[i];
            const match = itemIndex === s;
            if (!match) continue;
            results.push(item);
            selecting.splice(i, 1);
            break;
        }
    }

    return results as T;
};

const _testForwardFilter = () => {
    const words = [
        { id: 101, text: "hey" },
        { id: 202, text: "you" },
        { id: 303, text: "friend" },
    ];

    const selection: number[] = [202, 303];

    const results = forwardFilter(words, selection, (w) => w.id);

    console.log("input", words);
    console.log("results", results);
};

/**
    Forward Filter.
    Filters an array of items by a series of matching unique indexes.
    It moves forwards, so it doesn't double-check an index or item afterwards.
    The items' indexes and the selection indexes must be in the same order.
*/
export const forwardFilterOrdered = <T extends Array<any>>(items: T, selection: number[], selector: (i: T[0]) => number): T => {
    const results: Array<T[0]> = [];
    let iS: number = 0;

    for (const item of items) {
        const itemIndex = selector(item);
        // even though it's while, we only check 1 selectionIndex at a time
        const continueChecking = iS < selection.length;
        if (!continueChecking) break;
        const selectionIndex = selection[iS];
        const match = itemIndex === selectionIndex;
        // we're assuming selection does exist, but it's not this item
        // so don't increment as we still want this selection,
        // but stop checking this item as it is not the selection
        if (!match) continue;
        results.push(item);
        // there was a match, so increment to next selection
        iS++;
    }

    return results as T;
};

export const _testForwardFilterOrdered = () => {
    const words = [
        { id: 101, text: "hey" },
        { id: 202, text: "you" },
        { id: 303, text: "friend" },
        { id: 404, text: "." },
        { id: 505, text: "My" },
    ];

    const selection: number[] = [202, 303, 505, 909];

    const results = forwardFilterOrdered(words, selection, (w) => w.id);

    console.log("input", words);
    console.log("results", results);

    const expectedMatches = results.length === 3;
    const correctIds = results[0].id === 202 && results[1].id === 303 && results[2].id === 505;
    console.log("expected matches correct?", expectedMatches);
    console.log("correct ids in results?", correctIds);
};

/**
    Forward Filter supporting a set of contiguous items matching the index.
    This is useful when matching multiple items with the same group id index.
    Filters an array of items by a series of matching unique indexes.
    It moves forwards, so it doesn't double-check an index or item afterwards.
    The items' indexes and the selection indexes must be in the same order.
*/
export const forwardFilterOrderedContiguous = <T extends Array<any>>(items: T, selection: number[], selector: (i: T[0]) => number): T => {
    const results: Array<T[0]> = [];
    let lastItemIndex: number = items.length ? selector(items[0]) : 0;
    let iS: number = 0;

    for (const item of items) {
        const itemIndex = selector(item);
        // even though it's while, we only check 1 selectionIndex at a time
        const continueChecking = iS < selection.length;
        if (!continueChecking) break;
        const differentToLast = itemIndex !== lastItemIndex;
        if (differentToLast) iS++;
        const selectionIndex = selection[iS];
        const match = itemIndex === selectionIndex;
        // we're assuming selection does exist, but it's not this item
        // so don't increment as we still want this selection,
        // but stop checking this item as it is not the selection
        if (!match) {
            iS--;
            continue;
        }
        // there was a match, so add the item
        results.push(item);
        lastItemIndex = itemIndex;
    }

    return results as T;
};

export const _testForwardFilterOrderedContiguous = () => {
    const words = [
        { sid: 101, text: "hey" },
        { sid: 202, text: "you" },
        { sid: 303, text: "friend" },
        { sid: 303, text: "somewhere" },
        { sid: 404, text: "." },
        { sid: 505, text: "My" },
    ];

    const selection: number[] = [202, 303, 505, 909];

    const results = forwardFilterOrderedContiguous(words, selection, (w) => w.sid);

    console.log("input", words);
    console.log("results", results);

    const expectedMatches = results.length === 4;
    const correctIds = results[0].sid === 202 && results[1].sid === 303 && results[2].sid === 303 && results[3].sid === 505;
    console.log("expected matches correct?", expectedMatches);
    console.log("correct ids in results?", correctIds);
};
