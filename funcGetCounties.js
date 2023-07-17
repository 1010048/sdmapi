// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    const docs = context.services
    .get("mongodb-atlas")
    .db("sdapi_database")
    .collection("sdapi_collection")
    .find({})
    .sort({ publish_date: -1 }) // Sort by the "date" field in descending order
    .toArray();
    
    return docs;
};