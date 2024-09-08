import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";

const FilterSidebar = ({
  isVisible,
  onClose,
  subCategories,
  sorts,
  promotions,
  handleSubcategoryChange,
  handleSortClick,
  handlePromotionChange,
  selectedSort,
  selectedSubCategory,
  selectedPromotion,
  sidebarStyle,
}) => {
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: isVisible ? 0.5 : 0, // 0.5 for semi-transparent black
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, { opacity: opacityAnim }]} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] },
          sidebarStyle && sidebarStyle,
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top content */}
          <View style={[globalstyle.row, { justifyContent: "space-between" }]}>
            <Text style={[styles.header]}>Sort By</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={27} color="#000" style={{}} />
            </TouchableOpacity>
          </View>
          {/* Sorts */}
          <View style={styles.filtersContainer}>
            {sorts && (
              <View>
                {sorts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSortClick(item)}
                    style={[
                      styles.sortItemContainer,
                      item === selectedSort && styles.selectedItem,
                    ]}
                  >
                    <Text
                      style={[
                        globalstyle.text,
                        styles.sortItems,
                        item === selectedSort && styles.selectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* Sub categories */}
          {subCategories && (
            <View style={styles.filtersContainer}>
              <Text style={[styles.header]}>Sous-catégories</Text>

              <View>
                {Object.entries(subCategories).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => handleSubcategoryChange(key)}
                    style={[
                      styles.sortItemContainer,
                      key === selectedSubCategory && styles.selectedItem,
                    ]}
                  >
                    <Text
                      style={[
                        globalstyle.text,
                        styles.sortItems,
                        key === selectedSubCategory && styles.selectedText,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Promotions */}
          {promotions && (
            <View style={[styles.filtersContainer, { borderBottomWidth: 0 }]}>
              <Text style={[styles.header]}>Promotions</Text>

              <View>
                {Object.entries(promotions).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => handlePromotionChange(key)}
                    style={[
                      styles.sortItemContainer,
                      key === selectedPromotion && styles.selectedItem,
                    ]}
                  >
                    <Text
                      style={[
                        globalstyle.text,
                        styles.sortItems,
                        key === selectedPromotion && styles.selectedText,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 30,
    bottom: 10,
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    paddingHorizontal: 25,
    zIndex: 1001, // Higher than the overlay
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    zIndex: 1000, // Behind the sidebar
  },
  header: {
    fontSize: 21,
    fontFamily: "Mada_Bold",
    textTransform: "uppercase",
  },
  sortItemContainer: {
    padding: 10,
    borderRadius: 5,
  },
  sortItems: {
    fontSize: 17,
    fontFamily: "Mada_Medium",
    marginVertical: 8,
  },
  selectedItem: {
    backgroundColor: "#f0f0f0", // Background color for selected item
  },
  selectedText: {
    color: "#007AFF", // Text color for selected item
    fontWeight: "bold",
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    marginBottom: 25,
  },
});

export default FilterSidebar;
