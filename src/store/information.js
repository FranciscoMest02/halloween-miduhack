export const infoData = {
    items: [
    ],

    getItem(id) {
        return this.items.find(item => item.id === id);
      }
}