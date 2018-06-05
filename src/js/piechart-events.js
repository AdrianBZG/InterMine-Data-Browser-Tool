// This method takes the selection made in the sidebar and formats it accordingly to feed the logic constraint in the im-table query
function formatChartClickedSegmentAsConstraintForFilter(selection) {
    var result = [
        [],
        []
    ]

    result[0].push({
        "path": "organism.shortName",
        "op": "=",
        "value": selection.trim(), // Get only the organism short name of the selection, not the number
        "code": "A" // Assign it a unique code, to build the logical OR in the query
    });

    result[1].push("A");


    // Build the logic (OR)
    if (result[1].length > 1) {
        result[1] = result[1].join(" or ");
    } else {
        result[1] = result[1].join("");
    }

    return result;
}