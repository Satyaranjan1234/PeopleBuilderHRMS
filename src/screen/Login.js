

import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Pressable,
    ScrollView,
    TouchableOpacity,
    StatusBar
} from "react-native";
import styles from "../constants/styles";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    withTiming,
    withDelay,
    runOnJS,
    withSequence,
    withSpring
} from "react-native-reanimated";
import InputField from "../component/InputField";
import Letsgo from "../component/Letsgo";
import PeopleBuilder from "../component/PeopleBuilder";
import Welcome from "../component/Welcome";
import { useNavigation } from "@react-navigation/native";
import Loading from "../component/Loading";


export default function Login() {

    const navigation = useNavigation();

    StatusBar.setBarStyle('dark-content', true);
    StatusBar.setBackgroundColor('#afafaf');

    const { height, width } = Dimensions.get("window");
    const imagePosition = useSharedValue(1);
    const formButtonScale = useSharedValue(1);

    //loading state
    const [loading, setLoading] = useState(false);

    //Error state
    const [useridError, setuseridError] = useState('');
    const [passwordError, setpasswordError] = useState('');

    //Login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Fetch Data
    const apiUrl = 'https://hrexim.tranzol.com/api/apilogin/login';

    const myFetchPostRequest = async () => {
        try {
            const url = `${apiUrl}?username=${username}&password=${password}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Successful login
                navigation.replace('DrawerNavigation');
            } else {
                // Handle error response
                const errorData = await response.json();
                console.log('Login failed:', errorData);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // Handle login function
    const loginHandler = () => {
        imagePosition.value = 0;
    }

    //Login
    const login = () => {
        //Validation
        if (username === '' || password === '') {
            if (username == '')
                setuseridError('Enter User Id')
            else
                setuseridError('')

            if (password == '')
                setpasswordError('Fill Password...')
            else
                setpasswordError('')

        } else {
            setLoading(true)
            myFetchPostRequest()
                .then(response => {
                    if (response.ok && response.status == 200) {
                        AsyncStorage.setItem("username", userId)
                        setLoading(false);
                        navigation.replace('DrawerNavigation')
                        // console.log(response);
                    }

                    else {
                        setLoading(false);
                        alert("Invalid Login Credential !!")
                        setUsername('')
                        setPassword('')
                        console.log(response)
                    }
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false);
                    alert('Something Wants Wrong !!')
                })
        }
    };


    const imageAnimatedStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(
            imagePosition.value,
            [0, 1],
            [-height / 1.58, 0]
        );
        return {
            transform: [
                { translateY: withTiming(interpolation, { duration: 1000 }) },
            ],
        };
    });

    const buttonsAnimatedStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
        return {
            opacity: withTiming(imagePosition.value, { duration: 500 }),
            transform: [
                { translateY: withTiming(interpolation, { duration: 1000 }) },
            ],
        };
    });

    const closeButtonContainerStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
        return {
            opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
            transform: [
                { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
            ],
        };
    });

    const formAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity:
                imagePosition.value === 0
                    ? withDelay(400, withTiming(1, { duration: 800 }))
                    : withTiming(0, { duration: 300 }),
        };
    });

    const formButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: formButtonScale.value }]
        }
    })


    return (
        <Animated.View style={styles.container}>

            {/* loading */}
            {loading && <Loading />}

            <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle,]}>
                <Svg height={height + 100} width={width} >
                    <ClipPath id="clipPathId" >
                        <Ellipse cx={width / 2} rx={height} ry={height + 100} />
                    </ClipPath>
                    <Image
                        href={require("../assets/splash.jpg")}
                        width={width}
                        height={height + 100}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#clipPathId)"
                    />
                </Svg>

                <Animated.View
                    style={[styles.closeButtonContainer, closeButtonContainerStyle]}
                >
                    <TouchableOpacity style={{
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }} onPress={() => (imagePosition.value = 1)}>
                        <Text style={{ color: 'black', fontWeight: '700' }} >X</Text>
                    </TouchableOpacity>

                </Animated.View>
            </Animated.View>

            <View style={styles.bottomContainer} >
                <Animated.View style={[buttonsAnimatedStyle]}>
                    <View style={{ height: height / 2, width: '100%' }}>
                        <Welcome />
                        <PeopleBuilder />
                        <TouchableOpacity style={{ position: 'absolute', height: 160, width: 160, bottom: 0, right: 0 }} onPress={loginHandler}>
                            <Letsgo />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 14,
                            fontStyle: 'italic',
                            position: 'absolute',
                            bottom: 40,
                            color: 'black',
                            left: 60,
                        }}>Powered by TRANZOL</Text>
                    </View>
                </Animated.View>

                {/* Login */}
                <Animated.View style={[styles.formInputContainer, formAnimatedStyle,useridError || passwordError ? { marginTop: -50 } : {marginTop:10}]}>
                    <View>
                        <InputField
                            img={require('../assets/user.png')}
                            textInput={
                                <TextInput
                                    placeholder="User ID"
                                    placeholderTextColor="black"
                                    style={[{ marginLeft: 6, width: '90%', color: 'black', fontSize: 17 }]}
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                    }}
                                />
                            }
                        />

                        {/* error message */}
                        {useridError && (
                            <Text style={styles.errorText}>{useridError}</Text>
                        )}
                    </View>

                    <View>
                        <InputField
                            img={require('../assets/password.png')}
                            textInput={
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="black"
                                    style={[{ marginLeft: 6, width: '90%', color: 'black', fontSize: 17 }]}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                    }}
                                    secureTextEntry={true}
                                />
                            }
                        />

                        {/* error message */}
                        {passwordError ? (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        ) : null}
                    </View>

                    <Animated.View style={[formButtonAnimatedStyle, { marginBottom: 25 }]}>
                        <TouchableOpacity style={styles.formButton} onPress={() => {
                            formButtonScale.value = withSequence(withSpring(1.5), withSpring(1))
                            // navigation.replace('DrawerNavigation')
                            login()
                        }}>
                            <Text style={styles.buttonText}>
                                LOGIN
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </Animated.View>
            </View >

        </Animated.View >
    );
}
