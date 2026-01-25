export default eventHandler(async (event) => {
   const { data } = await readBody<{ data: string }>(event)
   const result = $crypt().decrypt(data)
   return {
      data: result
   }
})
