/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	DeployCodeToCloudNode14Opts:{

	},
	AccountType: "enum" as const,
	ChangeSubscriptionInput:{

	},
	Project:{
		cloudDeploymentStatus:{

		},
		members:{

		},
		sources:{

		}
	},
	ProjectsSortInput:{
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	PredictCheckoutInput:{

	},
	CustomerInput:{

	},
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	DeployCodeToCloudURIKind: "enum" as const,
	MarketplaceOps:{
		addProject:{
			opts:"AddProjectInput"
		},
		removeProject:{

		}
	},
	VatInput:{

	},
	Secret:{

	},
	CloudDeploymentStatus: "enum" as const,
	Decimal: `scalar.Decimal` as const,
	UpdateProject:{

	},
	CreateServiceAccountInput:{

	},
	SortOrder: "enum" as const,
	AddProjectInput:{
		npmRegistryPackage:"NpmRegistryPackageInput"
	},
	NewSource:{

	},
	SchemaSubscription:{
		watchJobStatus:{

		},
		watchLogs:{

		}
	},
	Query:{
		checkoutData:{
			data:"CheckoutDataInput"
		},
		exchangeServiceAccountKey:{

		},
		fileServerCredentials:{

		},
		findProjects:{

		},
		findProjectsByTag:{

		},
		getNamespace:{

		},
		getProject:{

		},
		getTeam:{

		},
		getUser:{

		},
		listProjects:{
			sort:"ProjectsSortInput"
		},
		myTeams:{

		},
		predictCheckout:{
			data:"PredictCheckoutInput"
		}
	},
	RenameFileInput:{

	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	Marketplace:{
		projects:{
			sort:"MarketplaceProjectsSortInput"
		}
	},
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	TeamOps:{
		addMember:{
			role:"Role"
		},
		createProject:{

		},
		createServiceAccount:{
			input:"CreateServiceAccountInput"
		},
		createServiceAccountApiKey:{

		},
		inviteToken:{
			role:"Role"
		},
		member:{

		},
		members:{

		},
		project:{

		},
		removeServiceAccount:{

		},
		removeServiceAccountApiKey:{

		},
		removeToken:{

		}
	},
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	Mutation:{
		changePassword:{

		},
		changeSubscription:{
			in:"ChangeSubscriptionInput"
		},
		consumeInviteToken:{

		},
		createCloudDeployment:{

		},
		createProject:{

		},
		createTeam:{

		},
		createUser:{

		},
		deployCodeToCloud:{
			opts:"DeployCodeToCloudInput"
		},
		deployToFaker:{

		},
		removeCloudDeployment:{

		},
		removeProject:{

		},
		runtimeLogs:{

		},
		setCloudDeploymentConfig:{
			input:"SetCloudDeploymentConfigInput"
		},
		sync:{

		},
		team:{

		},
		updateProject:{
			in:"UpdateProject"
		},
		updateSources:{
			sources:"NewSource"
		}
	},
	SetCloudDeploymentConfigCorsInput:{

	},
	DeployCodeToCloudInput:{
		kind:"DeployCodeToCloudURIKind",
		env:"DeployCodeToCloudEnv",
		secrets:"Secret",
		node14Opts:"DeployCodeToCloudNode14Opts"
	},
	ProjectOps:{
		addMember:{
			role:"Role"
		},
		createTemporaryFile:{

		},
		deployCodeToCloud:{
			opts:"DeployCodeToCloudInput"
		},
		removeSources:{

		},
		renameSources:{
			files:"RenameFileInput"
		},
		setCloudDeploymentConfig:{
			input:"SetCloudDeploymentConfigInput"
		},
		update:{
			in:"UpdateProject"
		}
	},
	SetCloudDeploymentConfigInput:{
		secrets:"Secret",
		cors:"SetCloudDeploymentConfigCorsInput"
	},
	DeployCodeToCloudEnv: "enum" as const,
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	MarketplaceProjectsSortInput:{
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder"
	},
	Role: "enum" as const,
	NpmRegistryPackageInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	MarketplaceItemConnection:{
		pageInfo:"PageInfo",
		projects:"MarketplaceItem"
	},
	Project:{
		cloudDeploymentConfig:"CloudDeploymentConfig",
		cloudDeploymentStatus:"CloudDeploymentStatus",
		createdAt:"RFC3339Date",
		dbConnection:"String",
		description:"String",
		enabled:"Boolean",
		endpoint:"Endpoint",
		id:"ID",
		inCloud:"Boolean",
		members:"MemberConnection",
		mocked:"Boolean",
		name:"String",
		owner:"User",
		public:"Boolean",
		slug:"String",
		sources:"FakerSourceConnection",
		tags:"String",
		team:"Team",
		updatedAt:"RFC3339Date",
		upstream:"String"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	User:{
		accountType:"AccountType",
		consentGiven:"Boolean",
		consentTimestamp:"Int",
		id:"ID",
		namespace:"Namespace",
		subscriptions:"SubscriptionConnection",
		username:"String"
	},
	Team:{
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
	},
	NpmRegistryPackage:{
		package:"String",
		registry:"String"
	},
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
	},
	MarketplaceOps:{
		addProject:"Boolean",
		removeProject:"Boolean"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
	},
	MarketplaceUpstream:{
		"...on NpmRegistryPackage":"NpmRegistryPackage"
	},
	CloudCorsSetting:{
		allowCredentials:"Boolean",
		allowedHeaders:"String",
		allowedMethod:"String",
		allowedOrigins:"String"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	Decimal: `scalar.Decimal` as const,
	Header:{
		key:"String",
		value:"String"
	},
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	SchemaSubscription:{
		watchJobStatus:"CloudDeploymentStatus",
		watchLogs:"String"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		getNamespace:"Namespace",
		getProject:"Project",
		getTeam:"Team",
		getUser:"User",
		listProjects:"ProjectConnection",
		marketplace:"Marketplace",
		myTeams:"TeamConnection",
		payments:"Payment",
		predictCheckout:"PredictCheckout"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	},
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	Marketplace:{
		projects:"MarketplaceItemConnection"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	TeamOps:{
		addMember:"Member",
		createProject:"Project",
		createServiceAccount:"ServiceAccount",
		createServiceAccountApiKey:"ServiceAccountApiKey",
		delete:"Boolean",
		id:"ID",
		inviteToken:"String",
		member:"MemberOps",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		project:"ProjectOps",
		removeServiceAccount:"Boolean",
		removeServiceAccountApiKey:"Boolean",
		removeToken:"String"
	},
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	CloudDeploymentConfig:{
		cors:"CloudCorsSetting",
		secrets:"SecretOutput"
	},
	Endpoint:{
		uri:"String"
	},
	Subscription:{
		cancelURL:"String",
		expiration:"String",
		quantity:"Int",
		seats:"UserConnection",
		status:"String",
		subscriptionID:"Int",
		subscriptionPlanID:"Int",
		updateURL:"String"
	},
	Mutation:{
		changePassword:"Boolean",
		changeSubscription:"Boolean",
		consumeInviteToken:"Boolean",
		createCloudDeployment:"String",
		createProject:"Project",
		createTeam:"TeamOps",
		createUser:"User",
		deleteAccount:"Boolean",
		deployCodeToCloud:"String",
		deployToFaker:"Boolean",
		marketplace:"MarketplaceOps",
		removeCloudDeployment:"String",
		removeProject:"Boolean",
		resendVerificationEmail:"Boolean",
		runtimeLogs:"String",
		setCloudDeploymentConfig:"Boolean",
		sync:"Boolean",
		team:"TeamOps",
		updateProject:"Boolean",
		updateSources:"SourceUploadInfo"
	},
	ProjectOps:{
		addMember:"Member",
		createCloudDeployment:"String",
		createTemporaryFile:"TemporaryFile",
		delete:"Boolean",
		deployCodeToCloud:"String",
		deployToFaker:"Boolean",
		removeCloudDeployment:"String",
		removeSources:"Boolean",
		renameSources:"Boolean",
		runtimeLogs:"String",
		setCloudDeploymentConfig:"Boolean",
		update:"Boolean"
	},
	SecretOutput:{
		name:"String",
		value:"String"
	},
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	MarketplaceItem:{
		project:"Project",
		upstream:"MarketplaceUpstream"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
	},
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	},
	InviteToken:{
		domain:"String",
		name:"String",
		removed:"Boolean",
		token:"String"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	}
}

export const Ops = {
subscription: "SchemaSubscription" as const,
	query: "Query" as const,
	mutation: "Mutation" as const
}