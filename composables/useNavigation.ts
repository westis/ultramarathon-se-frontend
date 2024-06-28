import { ref, onMounted } from "vue";

export const useNavigation = () => {
  const navigationItems = ref([]);

  const fetchNavigationItems = async () => {
    const sanity = useSanity();
    if (sanity && sanity.fetch) {
      const query = `*[_type == "navigationItem" && !defined(parent)]{..., children[]->}`;
      navigationItems.value = await sanity.fetch(query);
    } else {
      console.error("Sanity client not initialized or fetch method not found");
    }
  };

  onMounted(fetchNavigationItems);

  return {
    navigationItems,
  };
};
