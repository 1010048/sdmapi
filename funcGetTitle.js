exports = async function({ query, headers, body }, response) {
  const { keyWord } = query; // Assuming the filterValue is passed as a query parameter

  const collection = context.services
    .get("mongodb-atlas")
    .db("sdapi_database")
    .collection("sdapi_collection");

  const filter = {
    item_name: { $regex: keyWord, $options: "i" }
  };

  const docs = await collection
    .find(filter)
    .sort({ publish_date: -1 }) // Sort by the "publish_date" field in descending order
    .toArray();

  return docs;
};