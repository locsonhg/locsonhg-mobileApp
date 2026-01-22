import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, borderRadius } from "../theme";
import { 
  useCategories, 
  useCountries, 
  useMovieList
} from "../hooks/useOphimQueries";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { OPHIM_CONFIG, MOVIE_LIST_SLUGS } from "../constants/ophim";
import { MovieItem } from "../types/ophim";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 3) / COLUMN_COUNT;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CategoriesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // Filter States
  const [activeTab, setActiveTab] = useState<string>("all"); // all, series, single, animation
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("modified.time");
  const [page, setPage] = useState(1);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Data Fetching
  const { data: categoriesData, isLoading: isLoadingCats } = useCategories();
  const { data: countriesData } = useCountries();

  const getQueryParams = useMemo(() => ({
    page,
    limit: 20,
    category: selectedCategory || undefined,
    country: selectedCountry || undefined,
    sort_field: selectedSort as any,
    sort_type: "desc" as any,
  }), [page, selectedCategory, selectedCountry, selectedSort]);

  const activeSlug = useMemo(() => {
    switch(activeTab) {
      case "series": return MOVIE_LIST_SLUGS.SERIES;
      case "single": return MOVIE_LIST_SLUGS.SINGLE;
      case "animation": return MOVIE_LIST_SLUGS.ANIMATION;
      default: return MOVIE_LIST_SLUGS.NEW;
    }
  }, [activeTab]);

  const { data: moviesData, isLoading: isLoadingMovies, isFetching } = useMovieList(activeSlug, getQueryParams);

  const categories = categoriesData?.items || [];
  const countries = countriesData?.items || [];

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleCategoryPress = (slug: string | null) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    setSelectedSort("modified.time");
    setPage(1);
  };

  const renderMovieItem = ({ item }: { item: MovieItem }) => {
    const imageUrl = item.poster_url || item.thumb_url;
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${OPHIM_CONFIG.CDN_IMAGE_URL}/${imageUrl}`;

    return (
      <TouchableOpacity
        style={[styles.movieCard, { shadowColor: theme.colors.text }]}
        onPress={() => navigation.navigate("Detail", { slug: item.slug })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.poster}
          cachePolicy="memory-disk"
          contentFit="cover"
          transition={300}
        />
        
        {/* Quality Badge */}
        {item.quality && (
          <View style={styles.qualityBadgeSmall}>
            <Text style={styles.qualityTextSmall}>{item.quality}</Text>
          </View>
        )}

        {/* Year/Lang Badge */}
        <View style={styles.topRightBadges}>
           {item.lang && (
             <View style={styles.langBadgeSmall}>
               <Text style={styles.langTextSmall}>{item.lang}</Text>
             </View>
           )}
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.95)"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardInfo}>
            <Text style={styles.movieName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.metaText}>{item.year}</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText} numberOfLines={1}>{item.episode_current || "Full"}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.screenHeader}>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Khám phá</Text>
        <TouchableOpacity 
          style={[styles.filterIconButton, { backgroundColor: theme.colors.card }]}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color={theme.colors.primary} />
          {selectedCountry && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Main Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { id: "all", label: "Tất cả" },
            { id: "series", label: "Phim bộ" },
            { id: "single", label: "Phim lẻ" },
            { id: "animation", label: "Hoạt hình" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                activeTab === tab.id && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text style={[
                styles.tabLabel, 
                { color: activeTab === tab.id ? "#fff" : theme.colors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories Horizontal Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              { backgroundColor: !selectedCategory ? theme.colors.primary : theme.colors.card }
            ]}
            onPress={() => handleCategoryPress(null)}
          >
            <Text style={[
              styles.categoryLabel, 
              { color: !selectedCategory ? "#fff" : theme.colors.textSecondary }
            ]}>
              Tất cả thể loại
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.categoryChip,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                selectedCategory === cat.slug && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
              ]}
              onPress={() => handleCategoryPress(cat.slug)}
            >
              <Text style={[
                styles.categoryLabel, 
                { color: selectedCategory === cat.slug ? "#fff" : theme.colors.textSecondary }
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {(selectedCategory || selectedCountry) && (
        <View style={styles.activeFiltersRow}>
          <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
            Kết quả bộ lọc
          </Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>Xoá lọc</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={moviesData?.items || []}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item._id}
        numColumns={COLUMN_COUNT}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            {isFetching && <ActivityIndicator color={theme.colors.primary} />}
          </View>
        )}
        ListEmptyComponent={() => !isLoadingMovies ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Không tìm thấy phim phù hợp</Text>
          </View>
        ) : null}
      />

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Bộ lọc nâng cao</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Sort Filter */}
              <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Sắp xếp</Text>
              <View style={styles.filterGrid}>
                {[
                  { id: "modified.time", label: "Mới cập nhật" },
                  { id: "year", label: "Năm sản xuất" },
                  { id: "_id", label: "Mới đăng" },
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort.id}
                    style={[
                      styles.filterGridItem,
                      { borderColor: theme.colors.border },
                      selectedSort === sort.id && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedSort(sort.id)}
                  >
                    <Text style={[
                      styles.filterGridLabel,
                      { color: selectedSort === sort.id ? "#fff" : theme.colors.textSecondary }
                    ]}>
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Country Filter */}
              <Text style={[styles.filterLabel, { color: theme.colors.text, marginTop: spacing.lg }]}>Quốc gia</Text>
              <View style={styles.filterGrid}>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country._id}
                    style={[
                      styles.filterGridItem,
                      { borderColor: theme.colors.border },
                      selectedCountry === country.slug && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedCountry(selectedCountry === country.slug ? null : country.slug)}
                  >
                    <Text style={[
                      styles.filterGridLabel,
                      { color: selectedCountry === country.slug ? "#fff" : theme.colors.textSecondary }
                    ]}>
                      {country.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>


            </ScrollView>

            <TouchableOpacity 
              style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tabsContainer: {
    marginBottom: spacing.md,
  },
  tabsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tabItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  categoriesContainer: {
    marginBottom: spacing.sm,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: spacing.xl * 2,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  movieCard: {
    width: CARD_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: borderRadius.large,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#1a1a1a",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  cardInfo: {
    width: "100%",
  },
  movieName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "700",
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  qualityBadgeSmall: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(229, 9, 20, 0.95)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  qualityTextSmall: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  topRightBadges: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 4,
    zIndex: 2,
  },
  langBadgeSmall: {
    backgroundColor: "rgba(0, 200, 83, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  langTextSmall: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  footer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  modalScroll: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterGridItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
    alignItems: "center",
  },
  filterGridLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  applyButton: {
    marginTop: spacing.lg,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default CategoriesScreen;
