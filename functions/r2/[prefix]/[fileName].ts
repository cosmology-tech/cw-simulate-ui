interface Env {
  // Name of the binding bucket
  EXAMPLES_BUCKET: R2Bucket;
}

/**
 * This function is called when a request is made to the path /r2/[bucket]/[prefix]
 * @param context
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Validate bucket name and prefix
  const prefix = context.params.prefix;
  const fileName = context.params.fileName;
  if (!prefix) {
    return new Response("Invalid path", {status: 400});
  }

  console.log(`Query R2 bucket for prefix: ${prefix}/${fileName}`);
  const obj = await context.env.EXAMPLES_BUCKET.get(`${prefix}/${fileName}`);
  if (obj === null) {
    return new Response('Not found', {status: 404});
  }
  return new Response(obj.body);
}
