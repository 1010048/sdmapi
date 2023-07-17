exports = async function({ query, headers, body }, response) {
  const { startDate, endDate } = query; // Assuming the startTimestamp and endTimestamp are passed as query parameters

  const collection = context.services
    .get("mongodb-atlas")
    .db("sdapi_database")
    .collection("sdapi_collection");

  const startTimestamp = new Date(`${startDate.slice(0, 4)}-${startDate.slice(4, 6)}-${startDate.slice(6, 8)}`);
  const endTimestamp = new Date(`${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`);

  const filter = {
    publish_date: { $gte: startTimestamp.getTime() / 1000, $lte: endTimestamp.getTime() / 1000 }
  };

  const docs = await collection
    .find(filter)
    .sort({ publish_date: -1 }) // Sort by the "publish_date" field in descending order
    .toArray();

  return docs;
};