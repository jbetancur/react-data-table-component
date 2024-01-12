import { faker } from '@faker-js/faker';

const createUser = () => ({
	id: faker.string.uuid(),
	name: faker.internet.userName(),
	email: faker.internet.email(),
	address: faker.location.streetAddress(),
	bio: faker.lorem.sentence(),
	image: faker.image.avatar(),
});

const createUsers = (numUsers = 5) => new Array(numUsers).fill(undefined).map(createUser);

export default createUsers(20);
