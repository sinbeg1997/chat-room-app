let users = [];

exports.addUser = ({ id, name, room }) => {
    if (!name || !room) return { error: "name and room required." };
    const user = { id, name, room };

    users.push(user);

    return { user };
};

exports.removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index > -1) {
        return users[index];
    }
    return null;
};