import { describe, it, expect, beforeEach } from "vitest"
import usePeopleAssignment from "../../../app/composables/usePeopleAssignment"

describe("usePeopleAssignment", () => {
   beforeEach(() => {
      const { resetPeople } = usePeopleAssignment()
      resetPeople()
   })

   it("initializes with empty people list", () => {
      const { people } = usePeopleAssignment()
      expect(people.value).toEqual([])
   })

   it("adds and removes people", () => {
      const { people, addPerson, removePerson } = usePeopleAssignment()
      addPerson()
      expect(people.value).toHaveLength(1)
      expect(people.value[0]).toEqual({
         name: "",
         items: [],
         finalTotal: 0,
      })

      removePerson(0)
      expect(people.value).toHaveLength(0)
   })

   it("shares state across composable calls", () => {
      const instance1 = usePeopleAssignment()
      instance1.addPerson()

      const instance2 = usePeopleAssignment()
      expect(instance2.people.value).toHaveLength(1)
   })

   it("resets people", () => {
      const { people, addPerson, resetPeople } = usePeopleAssignment()
      addPerson()
      expect(people.value).toHaveLength(1)

      resetPeople()
      expect(people.value).toHaveLength(0)
   })
})
