module.exports = {
    loadUser: function (username) {
        return new Promise(function (resolve, reject) {
            resolve({username: "foo@bar.com", roles: ["ROLE_USER"]});
        });
    }
};