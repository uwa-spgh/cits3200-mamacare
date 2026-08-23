import { View, Pressable, StyleSheet, Text} from 'react-native';

type Props = {
    label: string;
    onPress: () => void;
}

export default function Button({ label, onPress }: Props) {
    return(
        <View style = { styles.buttonContainer }>
            <Pressable 
                style = { styles.button }
                onPress = {onPress}>

                <Text style = {styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({

    buttonContainer: {
        width: 320,
        height: 56,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: "#fff",
        fontSize: 16,
    },

    button: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: "#AE214D",
        flex:1,
    }
})