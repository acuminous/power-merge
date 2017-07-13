module.exports = function() {

    var merge

    this.get = function() {
        return merge
    }

    this.set = function(_merge) {
        merge = _merge
    }
}
