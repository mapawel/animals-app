# Animals API 
- Create an app which allows you to perform a set of actions on data send to you're app

## Objectives:
 - [ ] Create an app, address:  `http://127.0.0.1:<server-port>/animals`
 - [ ] Create an endpoint: `/all` should return all animals previously send to the app
 - [ ] Create an endpoint: `/animal/:id` should return an animal by id or allow to edit data of a particular animal
 - [ ] Create an endpoint: `/add/animals` should allow to add a list of animals to the app
 - [ ] Create an endpoint: `/add` should allow to add an animal to the app
 - [ ] Create an endpoint: `/add/:type` should allow to add a list of animals of a specific type
 - [ ] All animals should be saved to separate files under the: `files:<root>/animals/`
 - [ ] If an animal occur more than twice on the list of animals to save, should not be saved
 - [ ] If an animal occur twice on the list of animals to save, should be saved with data which occur as second
 - [ ] App should only accept `application/json` with `utf-8` 
 - [ ] App should return data only as `application/json` with `utf-8`
 - [ ] App should have at least 4 types of animals
