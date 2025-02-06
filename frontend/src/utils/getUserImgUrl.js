function getUserImgUrl (name) {
    return new URL(`../assets/users/${name}`, import.meta.url)
}
export {getUserImgUrl}