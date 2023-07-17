exports = async function({ query, headers, body }, response) {
  const collection = context.services
    .get("mongodb-atlas")
    .db("sdapi_database")
    .collection("sdapi_collection");

  try {
    // Parse the request body
    const parsedBody = JSON.parse(body.text());

    // Perform the insert operation and store the result in a variable
    const result = await collection.insertOne(parsedBody);

    // Return the result
    return result;
  } catch (error) {
    // If an error occurs, handle it gracefully
    console.error("Error occurred:", error);
    return { error: error.message };
  }
};
