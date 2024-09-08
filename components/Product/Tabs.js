import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Entypo } from "@expo/vector-icons";
import { globalstyle } from "../../styles/globalstyle";

const Tabs = ({ desc, guarantyTxt, shippingTxt, paymentTxt }) => {
  const [activeTab, setActiveTab] = useState(1);
  const { width } = useWindowDimensions();
  // console.log(desc);

  const tabs = [
    { id: 1, title: "Description", content: desc },
    { id: 2, title: "Garantie BULLMAN", content: guarantyTxt },
    { id: 3, title: "Expédition", content: shippingTxt },
    { id: 4, title: "Paiement sécurisé", content: paymentTxt },
  ];

  const domVisitors = {
    onElement: (element) => {
      // Check for divs with "flex-direction: row;" and convert to "flex-direction: column;"
      // if (element.name === "div" && element.attribs.style) {
      //   // Convert flex-direction from row to column
      //   if (element.attribs.style.includes("flex-direction: row;")) {
      //     element.attribs.style = element.attribs.style.replace(
      //       "flex-direction: row;",
      //       "flex-direction: column;"
      //     );
      //   }

      //   // Remove margin-left and margin-right
      //   element.attribs.style = element.attribs.style.replace(
      //     /margin-left: [^;]+;/g,
      //     ""
      //   );
      //   element.attribs.style = element.attribs.style.replace(
      //     /margin-right: [^;]+;/g,
      //     ""
      //   );
      // }
      if (
        element.name === "div" &&
        element.attribs.style &&
        element.attribs.style.includes("width: 35%")
      ) {
        element.attribs.style = element.attribs.style.replace(
          "width: 35%",
          "width: 45%"
        );
      }
      if (
        element.name === "div" &&
        element.attribs.style &&
        element.attribs.style.includes("width: 45%")
      ) {
        element.attribs.style = element.attribs.style.replace(
          "width: 45%",
          "width: 45%"
        );
      }
      if (element.name === "span" && element.attribs.class === "disque-bleu") {
        const newStyles = `
          background-color: #315593;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          text-align: center;
          line-height: 1;
        `;
        element.attribs.style = newStyles;
        const uTag = element.parent;
        if (uTag.name === "u") {
          // Get the grandparent (strong) and parent (u)
          const grandparent = uTag.parent;
          const greatGrandParent = grandparent.parent;

          // Remove the u tag but keep its children
          const children = uTag.children;

          // Remove the u tag from its parent
          grandparent.children = grandparent.children.filter(
            (child) => child !== uTag
          );
          // Add the original children of the u tag back to the grandparent
          const newDiv = {
            name: "div",
            attribs: {
              style: "display: flex; flex-direction: row; align-items: center;",
            },
            children: [children],
          };
          //console.log(...children);
          greatGrandParent.children.push(newDiv);

          // Remove sibling <br> tags
          const siblings = grandparent.children;
          for (let i = 0; i < siblings.length; i++) {
            if (siblings[i].name === "br") {
              siblings.splice(i, 1);
              i--; // Adjust index after removal
            }
          }
        }
      }
    },
  };

  const tagsStyles = {
    img: {
      width: "150px",
      height: "150px",
    },
    "span.disque-bleu": {
      backgroundColor: "#315593",
      color: "white",
      borderRadius: 9,
      width: 24,
      height: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: 18,
    },
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <View key={tab.id}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
          >
            <View style={[globalstyle.row]}>
              <Text style={styles.tabTitle}>{tab.title} </Text>
              <Entypo
                name="chevron-thin-right"
                size={16}
                color="black"
                style={activeTab === tab.id ? styles.iconRotated : styles.icon}
              />
            </View>
          </TouchableOpacity>
          {activeTab === tab.id && (
            <View style={styles.tabContent}>
              <ScrollView>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: tab.content }}
                  tagsStyles={tagsStyles}
                  domVisitors={domVisitors}
                  ignoredDomTags={["title"]}
                />
              </ScrollView>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tab: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#acacad",
  },
  tabTitle: {
    fontSize: 18,
    fontFamily: "Mada_SemiBold",
  },
  tabContent: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#acacad",
    marginBottom: 5,
    width: "100%",
  },
  contentWidth: {
    width: "100%",
  },
  icon: {
    transform: [{ rotate: "0deg" }],
  },
  iconRotated: {
    transform: [{ rotate: "90deg" }],
  },
});

export default Tabs;
