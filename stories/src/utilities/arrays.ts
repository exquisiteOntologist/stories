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
