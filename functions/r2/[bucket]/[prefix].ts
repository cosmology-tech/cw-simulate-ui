interface Env {
  EXAMPLES_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  console.log(context.params.bucket);
  console.log(context.params.prefix);

  return new Response("");
}
