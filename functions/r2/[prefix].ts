interface Env {
  EXAMPLES_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Validate bucket name and prefix
  const prefix = context.params.prefix;
  if (!prefix) {
    return new Response("Invalid path", {status: 400});
  }

  console.log(`Query R2 bucket for prefix: ${prefix}`);
  const obj = await context.env.EXAMPLES_BUCKET.get(prefix);
  if (obj === null) {
    return new Response('Not found', {status: 404});
  }
  return new Response(obj.body);
}
