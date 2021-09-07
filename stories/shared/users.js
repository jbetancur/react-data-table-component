import faker from 'faker';

const createUser = () => ({
	id: faker.datatype.uuid(),
	name: faker.name.findName(),
	email: faker.internet.email(),
	address: faker.address.streetAddress(),
	bio: faker.lorem.sentence(),
	image: faker.image.avatar(),
});

const createUsers = (numUsers = 5) => new Array(numUsers).fill(undefined).map(createUser);

export default createUsers(20);
