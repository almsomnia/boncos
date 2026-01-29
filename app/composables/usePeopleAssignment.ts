export default function () {
   const people = ref<PeopleAssignment[]>([])

   function addPerson() {
      people.value.push({
         name: "",
         items: [],
         finalTotal: 0
      })
   }

   function removePerson(index: number) {
      people.value.splice(index, 1)
   }

   return {
      people,
      addPerson,
      removePerson
   }
}
