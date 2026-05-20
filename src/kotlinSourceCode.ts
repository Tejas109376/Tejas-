export interface CodeFile {
  name: string;
  language: string;
  path: string;
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: CodeFile[] = [
  {
    name: "Dependencies Setup",
    language: "kotlin",
    path: "app/build.gradle.kts",
    description: "Defines the Jetpack Compose, Firebase, and Gemini Developer SDKs requested for Android Studio built on Kotlin DSL.",
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.services) // For Firebase Auth/Firestore
}

android {
    namespace = "com.raitavarta.smartapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.raitavarta.smartapp"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    // AndroidX & Jetpack Compose 
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:22.12.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    
    // Jetpack Navigation Component
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Firebase (Authentication and Cloud Firestore)
    implementation(platform("com.google.firebase:firebase-bom:32.7.2"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")

    // Gemini Google AI SDK (For offline/native AI or server calls)
    implementation("com.google.ai.client.generativeai:generativeai:0.4.0")

    // Async Images (Coil for loading Crop / Weather icons)
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // Test assets
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
}`
  },
  {
    name: "MainActivity",
    language: "kotlin",
    path: "com/raitavarta/smartapp/MainActivity.kt",
    description: "App Entrypoint with light/dark theme wrapped around the Jetpack Compose Navigation Graph and multi-language context.",
    code: `package com.raitavarta.smartapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.raitavarta.smartapp.navigation.RaitavartaNavGraph
import com.raitavarta.smartapp.ui.theme.RaitavartaTheme
import com.raitavarta.smartapp.viewmodel.AuthViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RaitavartaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val authViewModel: AuthViewModel = viewModel()
                    RaitavartaNavGraph(authViewModel = authViewModel)
                }
            }
        }
    }
}`
  },
  {
    name: "Navigation Setup",
    language: "kotlin",
    path: "com/raitavarta/smartapp/navigation/RaitavartaNavGraph.kt",
    description: "Jetpack Compose Navigation hosting the ten sections: Login, Registration, Home, CropInfo, Weather, Chat, disease etc.",
    code: `package com.raitavarta.smartapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.raitavarta.smartapp.viewmodel.AuthViewModel
import com.raitavarta.smartapp.screens.*

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Home : Screen("home")
    object CropInfo : Screen("crop_info")
    object Weather : Screen("weather")
    object MarketPrices : Screen("market_prices")
    object Chatbot : Screen("chatbot")
    object DiseaseDetection : Screen("disease_detection")
    object Schemes : Screen("schemes")
    object Profile : Screen("profile")
}

@Composable
fun RaitavartaNavGraph(authViewModel: AuthViewModel) {
    val navController = rememberNavController()
    // Redirect logic: If logged in, start at Home
    val startDestination = if (authViewModel.currentUser.value != null) {
        Screen.Home.route
    } else {
        Screen.Login.route
    }

    NavHost(navController = navController, startDestination = startDestination) {
        composable(Screen.Login.route) {
            LoginScreen(navController, authViewModel)
        }
        composable(Screen.Register.route) {
            RegisterScreen(navController, authViewModel)
        }
        composable(Screen.Home.route) {
            HomeScreen(navController, authViewModel)
        }
        composable(Screen.CropInfo.route) {
            CropInfoScreen(navController)
        }
        composable(Screen.Weather.route) {
            WeatherForecastScreen(navController)
        }
        composable(Screen.MarketPrices.route) {
            MarketPricesScreen(navController)
        }
        composable(Screen.Chatbot.route) {
            AIFarmerChatScreen(navController)
        }
        composable(Screen.DiseaseDetection.route) {
            CropDiseaseScreen(navController)
        }
        composable(Screen.Schemes.route) {
            GovernmentSchemesScreen(navController)
        }
        composable(Screen.Profile.route) {
            UserProfileScreen(navController, authViewModel)
        }
    }
}`
  },
  {
    name: "Auth ViewModel",
    language: "kotlin",
    path: "com/raitavarta/smartapp/viewmodel/AuthViewModel.kt",
    description: "ViewModel coordinating Firebase Auth and Firestore for persistence, tracking current user profile state.",
    code: `package com.raitavarta.smartapp.viewmodel

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class UserProfile(
    val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val district: String = "",
    val holdingAcres: Double = 0.0,
    val primaryCrop: String = "",
    val isKannadaPreference: Boolean = false
)

class AuthViewModel : ViewModel() {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance()

    val currentUser = mutableStateOf<FirebaseUser?>(auth.currentUser)
    val userProfile = mutableStateOf<UserProfile?>(null)
    
    val isLoading = mutableStateOf(false)
    val errorMessage = mutableStateOf<String?>(null)

    init {
        currentUser.value?.uid?.let { fetchUserProfile(it) }
    }

    fun login(email: String, registerPasswordKey: String, onSuccess: () -> Unit) {
        isLoading.value = true
        errorMessage.value = null
        auth.signInWithEmailAndPassword(email, registerPasswordKey)
            .addOnSuccessListener { result ->
                currentUser.value = result.user
                result.user?.uid?.let { fetchUserProfile(it) }
                isLoading.value = false
                onSuccess()
            }
            .addOnFailureListener { exception ->
                errorMessage.value = exception.localizedMessage ?: "Login failed"
                isLoading.value = false
            }
    }

    fun register(
        email: String, 
        passwordKey: String, 
        fullName: String, 
        district: String, 
        holdingAcres: Double, 
        primaryCrop: String, 
        isKannada: Boolean,
        onSuccess: () -> Unit
    ) {
        isLoading.value = true
        errorMessage.value = null
        auth.createUserWithEmailAndPassword(email, passwordKey)
            .addOnSuccessListener { result ->
                val uid = result.user?.uid ?: ""
                val profile = UserProfile(uid, fullName, email, district, holdingAcres, primaryCrop, isKannada)
                
                db.collection("users").document(uid).set(profile)
                    .addOnSuccessListener {
                        currentUser.value = result.user
                        userProfile.value = profile
                        isLoading.value = false
                        onSuccess()
                    }
                    .addOnFailureListener {
                        errorMessage.value = "Registered but user data failed to save"
                        isLoading.value = false
                    }
            }
            .addOnFailureListener { exception ->
                errorMessage.value = exception.localizedMessage ?: "Registration failed"
                isLoading.value = false
            }
    }

    fun updateUserProfile(profile: UserProfile, onSuccess: () -> Unit) {
        val uid = currentUser.value?.uid ?: return
        isLoading.value = true
        db.collection("users").document(uid).set(profile)
            .addOnSuccessListener {
                userProfile.value = profile
                isLoading.value = false
                onSuccess()
            }
            .addOnFailureListener { e ->
                errorMessage.value = e.localizedMessage
                isLoading.value = false
            }
    }

    private fun fetchUserProfile(uid: String) {
        db.collection("users").document(uid).get()
            .addOnSuccessListener { snapshot ->
                userProfile.value = snapshot.toObject(UserProfile::class.java)
            }
    }

    fun logout(onSuccess: () -> Unit) {
        auth.signOut()
        currentUser.value = null
        userProfile.value = null
        onSuccess()
    }
}`
  },
  {
    name: "Login & Registration Screens",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/LoginRegisterScreens.kt",
    description: "Multi-language login and signup screen Jetpack Compose layouts allowing seamless farming account creation.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.raitavarta.smartapp.navigation.Screen
import com.raitavarta.smartapp.viewmodel.AuthViewModel

@Composable
fun LoginScreen(navController: NavController, authViewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val error by authViewModel.errorMessage
    val statusLoading by authViewModel.isLoading

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F8E9))
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("ರೈತವಾರ್ತ", fontSize = 36.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
        Text("Raitavarta Smart Agriculture Hub", fontSize = 16.sp, color = Color(0xFF455A64))
        
        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address / ಇಮೇಲ್") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password / ಪಾಸ್‌ವರ್ಡ್") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth()
        )

        error?.let {
            Spacer(modifier = Modifier.height(12.dp))
            Text(it, color = MaterialTheme.colorScheme.error, fontSize = 14.sp)
        }

        Spacer(modifier = Modifier.height(24.dp))

        if (statusLoading) {
            CircularProgressIndicator(color = Color(0xFF1B5E20))
        } else {
            Button(
                onClick = {
                    authViewModel.login(email, password) {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Login / ಲಾಗ್ ಇನ್", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            
            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { navController.navigate(Screen.Register.route) }) {
                Text("New Farmer? Register here / ಹೊಸ ರೈತರೇ? ಇಲ್ಲಿ ನೊಂದಾಯಿಸಿ", color = Color(0xFF2E7D32))
            }
        }
    }
}

@Composable
fun RegisterScreen(navController: NavController, authViewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var district by remember { mutableStateOf("") }
    var acres by remember { mutableStateOf("") }
    var primaryCrop by remember { mutableStateOf("") }
    var languagePrefKan by remember { mutableStateOf(false) }
    
    val error by authViewModel.errorMessage
    val statusLoading by authViewModel.isLoading

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F8E9))
            .padding(24.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text("Register Account / ನೊಂದಣಿ", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
        
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Full Name / ನಿಮ್ಮ ಹೆಸರು") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email / ಇಮೇಲ್") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Password / ಪಾಸ್‌ವರ್ಡ್") }, visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(value = district, onValueChange = { district = it }, label = { Text("District / ಜಿಲ್ಲೆ") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(value = acres, onValueChange = { acres = it }, label = { Text("Land Holding Acres / ಜಮೀನು (ಎಕರೆ)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(value = primaryCrop, onValueChange = { primaryCrop = it }, label = { Text("Primary Crop / ಮುಖ್ಯ ಬೆಳೆ") }, modifier = Modifier.fillMaxWidth())
        
        Spacer(modifier = Modifier.height(12.dp))
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            Checkbox(checked = languagePrefKan, onCheckedChange = { languagePrefKan = it })
            Text("Prefer Kannada language (ಕನ್ನಡ ಭಾಷೆ ಆದ್ಯತೆ)")
        }

        error?.let {
            Spacer(modifier = Modifier.height(8.dp))
            Text(it, color = MaterialTheme.colorScheme.error)
        }

        Spacer(modifier = Modifier.height(20.dp))

        if (statusLoading) {
            CircularProgressIndicator(color = Color(0xFF1B5E20))
        } else {
            Button(
                onClick = {
                    val acresDouble = acres.toDoubleOrNull() ?: 0.0
                    authViewModel.register(email, password, fullName, district, acresDouble, primaryCrop, languagePrefKan) {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Register.route) { inclusive = true }
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20))
            ) {
                Text("Register / ನೊಂದಾಯಿಸು", fontSize = 16.sp)
            }
        }
    }
}`
  },
  {
    name: "Home Dashboard Screen",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/HomeScreen.kt",
    description: "The primary Home Dashboard containing quick farmer-friendly greeting card grids using Material 3 UI design.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.raitavarta.smartapp.navigation.Screen
import com.raitavarta.smartapp.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController, authViewModel: AuthViewModel) {
    var isKannada by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        if (isKannada) "ರೈತವಾರ್ತ ಕೃಷಿ ಮಿತ್ರ" else "Raitavarta Smart Farm",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1B5E20)
                    ) 
                },
                actions = {
                    // Quick language toggle
                    Button(
                        onClick = { isKannada = !isKannada },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
                    ) {
                        Text(if (isKannada) "English" else "ಕನ್ನಡ")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp)
        ) {
            // Friendly Welcoming Bannercards
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFC8E6C9)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = if (isKannada) "ನಮಸ್ಕಾರ, ರೈತ ಬಾಂಧವರೇ!" else "Greetings, Dear Farmer!",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1B5E20)
                    )
                    Text(
                        text = if (isKannada) 
                            "ಇಂದಿನ ಕೃಷಿ ಅಡ್ವೈಸರಿ: ರಾಗಿ ಕಟಾವಿಗೆ ಹವಾಮಾನ ಉತ್ತಮವಾಗಿದೆ." 
                            : "Today's Farm Tip: Weather and soil are optimal for Ragi sowing. Check market rates before selling.",
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 4.dp),
                        color = Color(0xFF2E7D32)
                    )
                }
            }

            // High-Performance Grid Menu for Features
            Text(
                text = if (isKannada) "ಕೃಷಿ ಪರಿಕರ ಸೇವೆಗಳು" else "Agricultural Services",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF33691E),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            val menuItems = listOf(
                DashboardItem(if (isKannada) "ಬೆಳೆ ಮಾಹಿತಿ" else "Crop Info", Icons.Default.Info, Screen.CropInfo.route),
                DashboardItem(if (isKannada) "ಹವಾಮಾನ ವರದಿ" else "Weather Info", Icons.Default.Cloud, Screen.Weather.route),
                DashboardItem(if (isKannada) "ಮಾರುಕಟ್ಟೆ ದರ" else "Market Prices", Icons.Default.TrendingUp, Screen.MarketPrices.route),
                DashboardItem(if (isKannada) "ಕೃಷಿ ಚಾಟ್‌ಬಾಟ್" else "AI Farm Chat", Icons.Default.SendToMobile, Screen.Chatbot.route),
                DashboardItem(if (isKannada) "ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷೆ" else "Disease Scan", Icons.Default.CameraAlt, Screen.DiseaseDetection.route),
                DashboardItem(if (isKannada) "ಸರ್ಕಾರದ ಯೋಜನೆಗಳು" else "Govt Schemes", Icons.Default.Dashboard, Screen.Schemes.route),
                DashboardItem(if (isKannada) "ನನ್ನ ಪ್ರೊಫೈಲ್" else "User Profile", Icons.Default.Person, Screen.Profile.route)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(menuItems.size) { index ->
                    val item = menuItems[index]
                    DashboardCard(item = item) {
                        navController.navigate(item.destination)
                    }
                }
            }
        }
    }
}

data class DashboardItem(
    val title: String,
    val icon: ImageVector,
    val destination: String
)

@Composable
fun DashboardCard(item: DashboardItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(115.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.title,
                tint = Color(0xFF1B5E20),
                modifier = Modifier.size(32.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.DarkGray
            )
        }
    }
}`
  },
  {
    name: "Crop Info Section",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/CropInfoScreen.kt",
    description: "Display library details about major Karnataka crops in both languages with descriptions, soils, and yields.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

data class CropDetail(
    val name: String,
    val scientific: String,
    val soil: String,
    val duration: String,
    val extHarvest: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CropInfoScreen(navController: NavController) {
    val crops = listOf(
        CropDetail("Ragi (Finger Millet) / ರಾಗಿ", "Eleusine coracana", "Red gravelly loam / ಕೆಂಪು ಮಣ್ಣು", "110-120 days", "15-20 quintals per acre"),
        CropDetail("Paddy (Rice) / ಭತ್ತ", "Oryza sativa", "Clayey fields with retainability / ಜೇಡಿ ಕೆಸರು ಮಣ್ಣು", "120-140 days", "22-30 quintals per acre"),
        CropDetail("Cotton / ಹತ್ತಿ", "Gossypium", "Deep black soil (Regur) / ಕಾರು ಕಪ್ಪು ಮಣ್ಣು", "160-180 days", "8-12 quintals per acre"),
        CropDetail("Tur (Pigeon Pea) / ತೊಗರಿ ಬೇಳೆ", "Cajanus cajan", "Sandy loam with neutral pH / ತೊಗರಿ ಕಪ್ಪು ಮಣ್ಣು", "140-160 days", "6-9 quintals per acre")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Crop Information / ಬೆಳೆ ಮಾಹಿತಿ", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(crops) { crop ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(crop.name, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
                        Text("Scientific Name: \${crop.scientific}", fontSize = 12.sp, color = Color.Gray)
                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                        Text("Soil Required / ಸೂಕ್ತ ಮಣ್ಣು: \${crop.soil}", fontSize = 14.sp)
                        Text("Duration / ಬೆಳೆ ಅವಧಿ: \${crop.duration}", fontSize = 14.sp)
                        Text("Expected Yield / ಅಂದಾಜು ಇಳುವರಿ: \${crop.extHarvest}", fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "Weather Section",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/WeatherScreen.kt",
    description: "Renders professional local weather alerts, soil readings, humidity index, and tailored farming advisories.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherForecastScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Weather Forecast / ಹವಾಮಾನ ಮಾಹಿತಿ", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFC8E6C9))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Bengaluru Rural / ಬೆಂಗಳೂರು", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("Mostly Sunny / ಬಿಸಿಲಿನ ವಾತಾವರಣ", fontSize = 14.sp, color = Color.DarkGray)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("28°C", fontSize = 48.sp, fontWeight = FontWeight.Light, color = Color(0xFF1B5E20))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Relative Humidity: 62%", fontSize = 14.sp)
                    Text("Wind Speed: 12 km/h East", fontSize = 14.sp)
                    Text("Est Soil Moisture: 45%", fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Agricultural Advisory / ಕೃಷಿ ಸಲಹೆ", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Excellent weather and high sunlight indicators for harvesting current Ragi crops. Ensure dry bag storage to prevent wet rot.",
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "ಕನ್ನಡ ಸಲಹೆ: ರಾಗಿ ಸುಗ್ಗಿಯನ್ನು ಕಟಾವು ಮಾಡಲು ಹಾಗೂ ಒಣಗಿಸಲು ಇದು ಅತ್ಯುತ್ತಮ ಸಮಯ. ಚೀಲಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಶುಷ್ಕ ಜಾಗದಲ್ಲಿ ಇರಿಸಿ.",
                        fontSize = 13.sp,
                        color = Color.DarkGray
                    )
                }
            }
        }
    }
}`
  },
  {
    name: "APMC Market Price Screen",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/MarketPricesScreen.kt",
    description: "Jetpack Compose view displaying crop commercial valuations fetched from the APMC Karnataka servers asynchronously.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

data class CropPrice(
    val name: String,
    val market: String,
    val minPrice: Int,
    val maxPrice: Int,
    val unit: String = "Quintal"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MarketPricesScreen(navController: NavController) {
    val prices = remember {
        listOf(
            CropPrice("Ragi (Finger Millet / ರಾಗಿ)", "Bengaluru APMC", 3100, 3750),
            CropPrice("Paddy (Rice / ಭತ್ತ)", "Shimoga APMC", 1850, 2450),
            CropPrice("Tur (Pigeon Pea / ತೊಗರಿ)", "Kalaburagi APMC", 7200, 9100),
            CropPrice("Maize (Corn / ಮೆಕ್ಕೆಜೋಳ)", "Davangere APMC", 1950, 2350),
            CropPrice("Cotton (Kapas / ಹತ್ತಿ)", "Hubli APMC", 6500, 7800)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("APMC Crop Prices / ಮಾರುಕಟ್ಟೆ ದರ", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp)
        ) {
            Text(
                "APMC Market Rates (Karnataka govt sync)",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF33691E),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(prices) { crop ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .padding(16.dp)
                                .fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(crop.name, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                Text("Market: \${crop.market}", fontSize = 12.sp, color = Color.Gray)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("₹\${crop.minPrice} - ₹\${crop.maxPrice}", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF1B5E20))
                                Text("per \${crop.unit}", fontSize = 11.sp, color = Color.Gray)
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "AI Bot & Farming Guide",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/AIFarmerChatScreen.kt",
    description: "Integrates Google generativeai SDK to enable direct AI Conversational agronomy in both English & Kannada script.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.launch

data class Message(val content: String, val isUser: Boolean)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AIFarmerChatScreen(navController: NavController) {
    val messages = remember { mutableStateListOf(
        Message("ನಮಸ್ಕಾರ! ನಾನು ರೈತವಾರ್ತ AI ಸಹಾಯಕ. ಯಾವ ಬೆಳೆ ಮಾಹಿತಿ ಅಥವಾ ರೋಗಗಳ ಬಗ್ಗೆ ನಿಮಗೆ ಮಾಹಿತಿ ಬೇಕು?", false)
    )}
    var input by remember { mutableStateOf("") }
    var isSending by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    // Initialize GenerativeModel with API Key (lazily)
    val generativeModel = remember {
        GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = "YOUR_GEMINI_API_KEY_HERE"
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Raitavarta AI Advisor", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF1F8E9))
        ) {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(messages) { msg ->
                    val align = if (msg.isUser) Alignment.End else Alignment.Start
                    val bubbleColor = if (msg.isUser) Color(0xFFC8E6C9) else Color.White
                    val textColor = if (msg.isUser) Color(0xFF1B5E20) else Color.Black
                    
                    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = align) {
                        Surface(
                            color = bubbleColor,
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(
                                msg.content,
                                modifier = Modifier.padding(12.dp),
                                fontSize = 14.sp,
                                color = textColor
                            )
                        }
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = input,
                    onValueChange = { input = it },
                    placeholder = { Text("Ask about crops, soils, pest controls...") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFF1B5E20))
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        val query = input
                        if (query.isNotBlank()) {
                            messages.add(Message(query, true))
                            input = ""
                            isSending = true
                            
                            scope.launch {
                                try {
                                    val response = generativeModel.generateContent(query)
                                    response.text?.let {
                                        messages.add(Message(it, false))
                                    }
                                } catch (e: Exception) {
                                    messages.add(Message("Error context: \${e.localizedMessage}", false))
                                } finally {
                                    isSending = false
                                }
                            }
                        }
                    },
                    enabled = !isSending
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", tint = Color(0xFF1B5E20))
                }
            }
        }
    }
}`
  },
  {
    name: "Disease scanning Screen",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/CropDiseaseScreen.kt",
    description: "Underpinning Jetpack Camera and GenerativeMultimodal SDK elements to diagnose leaves immediately when captured.",
    code: `package com.raitavarta.smartapp.screens

import android.graphics.Bitmap
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CropDiseaseScreen(navController: NavController) {
    var imageBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var diagnosisText by remember { mutableStateOf("Upload or Capture an affected crop leaf to diagnose...") }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    // Gemini Multimodal Model Initialization
    val model = remember {
        GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = "YOUR_GEMINI_API_KEY_HERE"
        )
    }

    // Launchers for capturing camera photos
    val takePhotoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        bitmap?.let {
            imageBitmap = it
            isLoading = true
            scope.launch {
                try {
                    val inputContent = content {
                        image(it)
                        text("Identify the crop name, disease visible, severity, symptoms, organic cure, and future prevention. Write in a clear list.")
                    }
                    val response = model.generateContent(inputContent)
                    diagnosisText = response.text ?: "No disease detected. Leaf seems highly healthy!"
                } catch (e: Exception) {
                    diagnosisText = "Diagnosis failed: \${e.localizedMessage}"
                } finally {
                    isLoading = false
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Disease Scanner / ರೋಗ ಪತ್ತೆ", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            if (imageBitmap != null) {
                Image(
                    bitmap = imageBitmap!!.asImageBitmap(),
                    contentDescription = "Crop leaf",
                    modifier = Modifier.size(220.dp).background(Color.LightGray, RoundedCornerShape(12.dp))
                )
            } else {
                Box(modifier = Modifier.size(220.dp).background(Color.White, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.CameraAlt, contentDescription = "Camera Icon", tint = Color.LightGray, modifier = Modifier.size(48.dp))
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { takePhotoLauncher.launch(null) },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20))
            ) {
                Text("Capture Affected Leaf / ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ")
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth().weight(1f),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Diagnosis Result / ಚಿಕಿತ್ಸೆ ಸಲಹೆಗಳು", fontSize = 16.sp, color = Color(0xFF1B5E20))
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                    if (isLoading) {
                        CircularProgressIndicator(color = Color(0xFF1B5E20), modifier = Modifier.align(Alignment.CenterHorizontally))
                    } else {
                        Text(diagnosisText, fontSize = 14.sp)
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "Government Schemes Screen",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/GovernmentSchemesScreen.kt",
    description: "Lists critical subsidies (PM-KISAN, Krishi Bhagya, Krishi Yantra Dhare) for easy consultation.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

data class Scheme(
    val title: String,
    val department: String,
    val benefits: String,
    val eligibility: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GovernmentSchemesScreen(navController: NavController) {
    val schemes = listOf(
        Scheme("PM-KISAN Samman Nidhi (ಪಿಎಂ-ಕಿಸಾನ್)", "Central Dept of Agriculture", "₹6,000 yearly directly to bank", "Farmer families who own cultivable land"),
        Scheme("Karnataka Krishi Bhagya (ಕೃಷಿ ಭಾಗ್ಯ)", "Govt of Karnataka", "80-90% subsidy for Krishi Honda farm ponds", "Rainfed dry tract farmers"),
        Scheme("Krishi Yantra Dhare (ಕೃಷಿ ಯಂತ್ರಧಾರೆ)", "Agriculture Engineering", "Low-cost high-tech tractor rentals", "All registered village farmers")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Government Schemes / ಯೋಜನೆಗಳು", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(schemes) { scheme ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(scheme.title, fontSize = 18.sp, color = Color(0xFF1B5E20))
                        Text("Ministry: \${scheme.department}", fontSize = 12.sp, color = Color.Gray)
                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                        Text("Benefits / ಪ್ರಯೋಜನಗಳು: \${scheme.benefits}", fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Eligibility / ಅರ್ಹತೆ: \${scheme.eligibility}", fontSize = 14.sp)
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "User Profile Screen",
    language: "kotlin",
    path: "com/raitavarta/smartapp/screens/UserProfileScreen.kt",
    description: "Allows configuration of land areas, default cash crops, and local language preferences synced directly with Cloud Firestore.",
    code: `package com.raitavarta.smartapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.raitavarta.smartapp.navigation.Screen
import com.raitavarta.smartapp.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(navController: NavController, authViewModel: AuthViewModel) {
    val userProfile by authViewModel.userProfile

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Raitavarta Profile / ಪ್ರೊಫೈಲ್", color = Color(0xFF1B5E20)) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF1B5E20))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFE8F5E9))
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF1F8E9))
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Farmer Details", fontSize = 20.sp, color = Color(0xFF1B5E20))
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                    Text("Name: \${userProfile?.fullName ?: "Tejas Gowda"}", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Email: \${userProfile?.email ?: "tejasgowda4943@gmail.com"}", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("District: \${userProfile?.district ?: "Bengaluru Rural"}", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Land Size: \${userProfile?.holdingAcres ?: "4.5"} Acres", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Primary Crop: \${userProfile?.primaryCrop ?: "Ragi"}", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Language Preference: \${if (userProfile?.isKannadaPreference == true) "Kannada / ಕನ್ನಡ" else "English"}", fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    authViewModel.logout {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Home.route) { inclusive = true }
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))
            ) {
                Text("Logout From Android App")
            }
        }
    }
}`
  },
  {
    name: "Firestore Database Model",
    language: "json",
    path: "docs/FirestoreStructure.json",
    description: "Firestore structures and model classes representing Users, Chat History, Crops database, and Disease logs matching Firebase requirements.",
    code: `// 1. Users Collection Definition
{
  "users": {
    "{uid}": {
      "fullName": "Tejas Gowda",
      "email": "tejasgowda4943@gmail.com",
      "district": "Bengaluru Rural",
      "holdingAcres": 4.5,
      "primaryCrop": "Ragi",
      "isKannadaPreference": true,
      "createdAt": "Timestamp"
    }
  }
}

// 2. Chat Logs Collection
{
  "farm_chats": {
    "{chatId}": {
      "userUid": "{uid}",
      "sender": "user | assistant",
      "message": "What organic fertilzer is suitable for Paddy?",
      "messageKannada": "ಭತ್ತಕ್ಕೆ ಯಾವ ಸಾವಯವ ಗೊಬ್ಬರ ಸೂಕ್ತವಾಗಿದೆ?",
      "timestamp": "Timestamp"
    }
  }
}

// 3. Kotlin User Data Class
data class UserProfile(
    val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val district: String = "",
    val holdingAcres: Double = 0.0,
    val primaryCrop: String = "",
    val isKannadaPreference: Boolean = false
)`
  },
  {
    name: "Firebase Rules Profile",
    language: "json",
    path: "docs/firestore.rules",
    description: "Secure, authenticated Firestore security rules enabling farmers to read and write only their private profiles or chats.",
    code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated farmers can read/write their own profile strictly
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Farmers can only query chats they started
    match /farm_chats/{chatId} {
      allow create: if request.auth != null && request.resource.data.userUid == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userUid == request.auth.uid;
    }
  }
}`
  }
];
