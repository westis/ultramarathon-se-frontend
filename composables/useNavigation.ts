// ~/composables/useNavigation.ts
import { ref, onMounted } from "vue";
import type { NavigationItem } from "~/types/navigation";

export const useNavigation = () => {
  const navigationItems = ref<NavigationItem[]>([]);

  const fetchNavigationItems = async () => {
    const sanity = useSanity();
    if (sanity && sanity.fetch) {
      const query = `
        *[_type == "navigation" && title == "Huvudmeny"][0]{
          items[]{
            title,
            "slug": slug.current,
            children[]{
              title,
              "slug": slug.current,
              children[]{
                title,
                "slug": slug.current
              }
            }
          }
        }
      `;
      const data = await sanity.fetch(query);
      console.log("Fetched data from Sanity:", data); // Log the fetched data
      navigationItems.value = data?.items || [];
    } else {
      console.error("Sanity client not initialized or fetch method not found");
    }
  };

  onMounted(fetchNavigationItems);

  return {
    navigationItems,
  };
};
