exports = async function({ query, headers, body }, response) {
  const { keyWord } = query; // Assuming the keyWord is passed as a query parameter

  const collection = context.services
    .get("mongodb-atlas")
    .db("sdapi_database")
    .collection("sdapi_collection");

  const filter = {
    $or: [
      { item_name: { $regex: keyWord, $options: "i" } }, // Searching in item_name field
      { excerpt: { $regex: keyWord, $options: "i" } }, // Replace 'field2' with the actual field name
      { category: { $regex: keyWord, $options: "i" } }, // Replace 'field3' with another field name, if needed
      { county: { $regex: keyWord, $options: "i" } }, // Replace 'field3' with another field name, if needed
      { author: { $regex: keyWord, $options: "i" } }, // Replace 'field3' with another field name, if needed
      // Add more fields to search in as needed
    ]
  };

  const docs = await collection
    .find(filter)
    .sort({ publish_date: -1 }) // Sort by the "publish_date" field in descending order
    .toArray();

  return docs;
};