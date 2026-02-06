import type { PeopleAssignment } from "#shared/types"

export default function () {
   const people = useState<PeopleAssignment[]>("people-assignment", () => [])

   function addPerson() {
      people.value.push({
         name: "",
         items: [],
         finalTotal: 0,
      })
   }

   function removePerson(index: number) {
      people.value.splice(index, 1)
   }

   function resetPeople() {
      people.value = []
   }

   return {
      people,
      addPerson,
      removePerson,
      resetPeople,
   }
}
