export default eventHandler(async (event) => {
   const { data } = await readBody<{ data: string }>(event)
   return $crypt().encrypt(data)
})
