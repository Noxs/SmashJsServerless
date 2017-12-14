module.exports = {
    getUser: function (username) {
        return new Promise(function (resolve, reject) {
            resolve({username: "foo@bar.com", roles: ["ROLE_USER"]});
        });
    }
};