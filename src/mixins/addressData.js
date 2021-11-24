export default {
  methods: {
    // 郵便番号（前半3桁）
    postalCodeA(post) {
      return post.address?.["postalCode"].slice(0, 3);
    },
    // 郵便番号（後半4桁）
    postalCodeB(post) {
      return post.address?.["postalCode"].slice(3);
    },
    // 都道府県
    prefecture(post) {
      return post.address?.["prefecture"];
    },
    // 市区町村
    municipality(post) {
      return post.address?.["municipality"];
    },
    townName(post) {
      return post.address?.["townName"];
    },
    buildingName(post) {
      return post.address?.["buildingName"];
    },
    // 住所のデータを連結して返す
    addressData(post) {
      return (
        this.prefecture(post) +
        this.municipality(post) +
        this.townName(post) +
        this.buildingName(post)
      );
    },
  },
};
