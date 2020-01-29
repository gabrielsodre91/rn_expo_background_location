import React, { useEffect } from 'react';

import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native';

import { connect } from 'react-redux';

import * as LocationActions from '../store/actions/location';

import store from '../store';

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import * as CONFIG from '../config';

const LOCATION_TASK_NAME = 'background-location-task';

const formatarData = data => `${('00' + data.getDate()).slice(-2)}/${('00' + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${('00' + data.getHours()).slice(-2)}:${('00' + data.getMinutes()).slice(-2)}:${('00' + data.getSeconds()).slice(-2)}`;

const Locations = ({ locations }) => {

    useEffect(() => {
        const inicializar = async () => {
            const { status } = await Location.requestPermissionsAsync();

            if (status === 'granted') {
                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 50,
                    foregroundService: {
                        notificationTitle: 'Rastreamento',
                        notificationBody: 'Rastreando sua posição'
                    },
                    pausesUpdatesAutomatically: false,
                });
            }
        }

        const verificaGPS = async () => {
            const gpsLigado = await Location.hasServicesEnabledAsync();

            if (!gpsLigado) {
                Alert.alert('Ative o GPS', 'Seu GPS precisa estar ativado.', [
                    { text: 'OK', onPress: () => { } }
                ]);

                setTimeout(verificaGPS, 5000);
            } else {
                inicializar();
            }
        }

        verificaGPS();
    }, []);


    return (
        <>
            <View style={styles.tituloContainer}>
                <Text style={styles.tituloTexto}>HISTÓRICO DE LOCALIZAÇÕES</Text>
            </View>

            <View style={styles.containerText}>
                <Text style={styles.tituloTexto}>Última localização</Text>
            </View>

            {locations.length > 0 && <Image
                style={styles.imagem}
                source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${locations[locations.length - 1].latitude},${locations[locations.length - 1].longitude}&zoom=17,5&size=600x300&maptype=roadmap&markers=color:red%7Clabel:L%7C${locations[locations.length - 1].latitude},${locations[locations.length - 1].longitude}&key=${CONFIG.API_GOOGLE_MAPS}` }}
            />}
            
            <View style={styles.containerText}>
                <Text style={styles.tituloTexto}>Localizações (últimas 5)</Text>
            </View>

            {locations.length > 0 && <FlatList
                style={styles.lista}
                data={locations}
                renderItem={({ item }) => (
                    <View style={styles.itemLista}>
                        <Text style={styles.labelLista}>Data:</Text>
                        <Text style={styles.valorLista}>{item.data}</Text>

                        <Text style={styles.labelLista}>Lat:</Text>
                        <Text style={styles.valorLista}>{item.latitude}</Text>

                        <Text style={styles.labelLista}>Lng:</Text>
                        <Text style={styles.valorLista}>{item.longitude}</Text>
                    </View>
                )}
                keyExtractor={item => String(item.id)}
            />}
        </>
    );
}

const styles = StyleSheet.create({
    imagem: {
        width: Dimensions.get('window').width - 20,
        flex: 1,
        margin: 10,
        backgroundColor: '#e1e4e8'
    },

    tituloContainer: {
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: '#612F74'
    },

    tituloTexto: {
        color: '#eee'
    },

    containerText: {
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: '#836FFF',
        borderRadius: 5,
        margin: 10,
        borderLeftColor: '#612F74',
        borderLeftWidth: 3
    },

    lista: {
        marginHorizontal: 15,
        flex: 1
    },

    itemLista: {
        borderBottomWidth: 1,
        flexDirection: 'row'
    },

    labelLista: {
        fontWeight: 'bold',
        fontSize: 10,
        color: '#999',
        flex: 10
    },

    valorLista: {
        fontSize: 12,
        flex: 20
    }
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.log(error);
        return;
    }

    if (data) {
        const { latitude, longitude } = data.locations[0].coords;

        let ultimaLocalizacao = {
            id: Math.random(),
            data: formatarData(new Date()),
            latitude,
            longitude
        }

        store.dispatch(LocationActions.addLocation(ultimaLocalizacao));
    }
});

const mapStateToProps = state => {
    return {
        locations: state.location.locations
    }
};

export default connect(mapStateToProps)(Locations);